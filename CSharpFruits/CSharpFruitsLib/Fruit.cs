using System;

namespace CSharpFruitsLib
{
    public class Fruit
    {
        public enum MassUnit
        {
            g = 1,
            kg = 1000
        }

        public string Name { get; protected set; }
        public decimal Price { get; protected set; }
        public decimal Amount { get; protected set; }
        public MassUnit AmountUnit { get; protected set; }
        public decimal AmountInGrams { get; protected set; }

        public Fruit(string name, decimal price, decimal amount, string amountUnit)
        {
            Name = name;
            Price = price;
            Amount = amount;
            (AmountInGrams, AmountUnit) = NormalizeWeight(amount, amountUnit);
        }

        protected static (decimal amountInGrams, MassUnit amountUnit) NormalizeWeight(decimal amount, string amountUnit)
        {
            if(!Enum.TryParse(amountUnit, out MassUnit unit))
            {
                throw new ArgumentOutOfRangeException("amountUnit", amountUnit, "Only g and kg are currently supported.");
            }

            return (amount * (int)unit, unit);
        }

        public override string ToString()
        {
            return Name + "\t$" + Price + "\t" + Amount + " " + AmountUnit;
        }
    }
}
