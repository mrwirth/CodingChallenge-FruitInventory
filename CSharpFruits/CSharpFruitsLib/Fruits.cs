using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CSharpFruitsLib
{
    public static class Fruits
    {
        public static IEnumerable<Fruit> GetFruits(string rawData)
        {
            return rawData.SplitData().ParseData();
        }

        private static (string, IEnumerable<string>) SplitData(this string data)
        {
            var rows = data.Split('\n');
            var headerRow = rows[0];
            var dataRows = rows.Skip(2);
            return (headerRow, dataRows);
        }

        private static IEnumerable<Fruit> ParseData(this (string header, IEnumerable<string> rows) data)
        {
            var names = FindIndexes("Product name", data.header);
            var prices = FindIndexes("Unit price", data.header);
            var amounts = FindIndexes("Amount", data.header);

            var numberPattern = new Regex(@"[0-9.]+");
            var unitPattern = new Regex(@"[A-Za-z]+");
            foreach (var row in data.rows)
            {
                var name = row.Substring(names.start, names.length).Trim();
                var amountText = row.Substring(amounts.start, amounts.length).Trim();
                var amount = decimal.Parse(numberPattern.Match(amountText).Value);
                var amountUnit = unitPattern.Match(amountText).Value.Trim();
                var priceText = row.Substring(prices.start, prices.length).Trim();
                var price = decimal.Parse(numberPattern.Match(priceText).Value);
                yield return new Fruit(name, price, amount, amountUnit);
            }
            yield break;
        }

        private static (int start, int length) FindIndexes(string columnName, string header)
        {
            var pattern = new Regex(columnName + @"\s+");
            var match = pattern.Match(header);
            var start = match.Index;
            var length = match.Length;
            return (start, length);
        }

        public static IEnumerable<Fruit> DeduplicateBy<T>(this IEnumerable<Fruit> fruits, Func<Fruit, T> key)
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

        public static IEnumerable<Fruit> Deduplicate(this IEnumerable<Fruit> fruits)
        {
            return fruits.DeduplicateBy(x => x);
        }
    }
}
