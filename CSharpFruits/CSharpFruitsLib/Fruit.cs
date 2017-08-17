using System;

namespace CSharpFruitsLib
{
    public class Fruit
    {
        public string Name { get; protected set; }
        public decimal Price { get; protected set; }
        public decimal Amount { get; protected set; }
        public string AmountUnit { get; protected set; }
        public decimal AmountInGrams { get; protected set; }

        public Fruit(string name, decimal price, decimal amount, string amountUnit)
        {
            Name = name;
            Price = price;
            Amount = amount;
            AmountUnit = amountUnit;
            AmountInGrams = NormalizeWeight(amount, amountUnit);
        }

        protected static decimal NormalizeWeight(decimal amount, string amountUnit)
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
