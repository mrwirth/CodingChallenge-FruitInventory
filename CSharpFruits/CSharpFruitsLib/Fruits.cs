using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSharpFruitsLib
{
    public class Fruit
    {
        public string Name { get; }
        public decimal Price { get; }
        decimal Amount { get; }
        string AmountUnit { get; }
        decimal NormalizedAmount { get; }

        public Fruit(string name, decimal price, string priceUnit, decimal amount, string amountUnit)
        {
            Name = name;
            Price = price;
            Amount = amount;
            AmountUnit = amountUnit;
            NormalizedAmount = NormalizeWeight(amount, amountUnit);
        }

        private static decimal NormalizeWeight(decimal amount, string amountUnit)
        {
            if (amountUnit == "g") { return amount; };
            if (amountUnit == "kg") { return amount * 1000; };
            throw new ArgumentOutOfRangeException("amountUnit", amountUnit, "Only g and kg are currently supported.");
        }
    }

    public static class Fruits
    {
        public static IEnumerable<Fruit> GetFruits(string url)
        {
            throw new NotImplementedException();
        }
    }
}
