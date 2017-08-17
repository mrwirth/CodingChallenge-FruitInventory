using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CSharpFruitsLib
{
    public static class Fruits
    {
        private struct ColumnData
        {
            public int Start { get; } // Start index for column
            public int Length { get; } // Length of column

            public ColumnData(int start, int length)
            {
                Start = start;
                Length = length;
            }
        }

        private struct ColumnDataSet
        {
            public ColumnData NameColumn { get; }
            public ColumnData PriceColumn { get; }
            public ColumnData AmountColumn { get; }

            public ColumnDataSet(ColumnData nameColumn, ColumnData priceColumn, ColumnData amountColumn)
            {
                NameColumn = nameColumn;
                PriceColumn = priceColumn;
                AmountColumn = amountColumn;
            }

            public void Deconstruct(out ColumnData nameColumn, out ColumnData priceColumn, out ColumnData amountColumn)
            {
                nameColumn = NameColumn;
                priceColumn = PriceColumn;
                amountColumn = AmountColumn;
            }
        }

        public static IEnumerable<Fruit> ParseTable(string table)
        {
            var rows = table.Split('\n');
            if (rows.Length < 2) { throw new ArgumentException("Argument is not in a table format recognized by this library.", "table"); }
            var header = rows[0];
            var columns = ParseHeader(header);
            var data = rows.Skip(2);
            foreach (var row in data)
            {
                yield return ParseRow(row, columns);
            }
            yield break;
        }

        public static IEnumerable<Fruit> ParseTable(Stream stream)
        {
            using (var reader = new StreamReader(stream))
            {
                var header = reader.ReadLine();
                var columns = ParseHeader(header);
                reader.ReadLine(); // Skip divider line.
                string row;
                while ((row = reader.ReadLine()) != null)
                {
                    yield return ParseRow(row, columns);
                }
            }
            yield break;
        }

        private static ColumnDataSet ParseHeader(string header)
        {
            if (header is null) { throw new ArgumentNullException("header"); }
            var nameColumn = FindColumnData("Product name", header);
            var priceColumn = FindColumnData("Unit price", header);
            var amountColumn = FindColumnData("Amount", header);

            return new ColumnDataSet(nameColumn, priceColumn, amountColumn);
        }

        private static ColumnData FindColumnData(string columnName, string header)
        {
            var pattern = new Regex(columnName + @"\s+");
            var match = pattern.Match(header);
            var start = match.Index;
            var length = match.Length;
            return new ColumnData(start, length);
        }

        private static Fruit ParseRow(string row, ColumnDataSet columns)
        {
            var (nameColumn, priceColumn, amountColumn) = columns;

            var name = row.Substring(nameColumn.Start, nameColumn.Length).Trim();
            var amount = ParseAmount(row, amountColumn);
            var price = ParsePrice(row, priceColumn);
            return new Fruit(name, price, amount.quantity, amount.unit);
        }

        private static (decimal quantity, string unit) ParseAmount(string row, ColumnData amountColumn)
        {
            // I've profiled a few alternatives to extracting the `quantityText` value from the column text:
            // * TakeWhile -> char[] -> new string
            // * TakeWhile -> Count -> Substring
            // * IndexOfAny(char[]_of_all_letters) -> Substring
            // And this version was consistently fastest.
            var columnText = row.Substring(amountColumn.Start, amountColumn.Length);
            var unitStart = columnText.TakeWhile(c => !Char.IsLetter(c)).Count();
            var quantityText = columnText.Substring(0, unitStart);
            var unit = columnText.Substring(unitStart).Trim();
            if(!decimal.TryParse(quantityText, NumberStyles.Number, new CultureInfo("en-US", false), out var quantity))
            {
                throw new ArgumentException("Row does not contain a parseable Amount column quantity.", "row");
            }

            return (quantity, unit);
        }

        private static decimal ParsePrice(string row, ColumnData priceColumn)
        {
            var columnText = row.Substring(priceColumn.Start, priceColumn.Length);
            if(!decimal.TryParse(columnText, NumberStyles.Currency, new CultureInfo("en-US", false), out var price))
            {
                throw new ArgumentException("Row does not contain a parseable Price column quantity.", "row");
            }

            return price;
        }

        public static IEnumerable<Fruit> DistinctBy<T>(this IEnumerable<Fruit> fruits, Func<Fruit, T> key)
        {
            var seen = new HashSet<T>();
            foreach (var fruit in fruits)
            {
                if (!seen.Contains(key(fruit)))
                {
                    seen.Add(key(fruit));
                    yield return fruit;
                }
            }
            yield break;
        }
    }
}
