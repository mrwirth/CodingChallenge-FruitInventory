using System;
using System.Collections.Generic;
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

            var numberPattern = new Regex(@"[0-9.]+");
            var unitPattern = new Regex(@"[A-Za-z]+");

            var name = row.Substring(nameColumn.Start, nameColumn.Length).Trim();
            var amountText = row.Substring(amountColumn.Start, amountColumn.Length).Trim();
            var amount = decimal.Parse(numberPattern.Match(amountText).Value);
            var amountUnit = unitPattern.Match(amountText).Value.Trim();
            var priceText = row.Substring(priceColumn.Start, priceColumn.Length).Trim();
            var price = decimal.Parse(numberPattern.Match(priceText).Value);
            return new Fruit(name, price, amount, amountUnit);
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
