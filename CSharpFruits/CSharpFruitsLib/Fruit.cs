using System;

namespace CSharpFruitsLib
{
    public class Fruit
    {
        public string Name { get; }
        public decimal Price { get; }
        public decimal Amount { get; }
        public string AmountUnit { get; }
        public decimal AmountInGrams { get; }

        public Fruit(string name, decimal price, decimal amount, string amountUnit)
        {
            Name = name;
            Price = price;
            Amount = amount;
            AmountUnit = amountUnit;
            AmountInGrams = NormalizeWeight(amount, amountUnit);
        }

        private static decimal NormalizeWeight(decimal amount, string amountUnit)
        {
            if (amountUnit == "g") { return amount; };
            if (amountUnit == "kg") { return amount * 1000; };
            throw new ArgumentOutOfRangeException("amountUnit", amountUnit, "Only g and kg are currently supported.");
        }

        public override string ToString()
        {
            return Name + "\t$" + Price + "\t" + Amount + " " + AmountUnit;
        }
    }
}
