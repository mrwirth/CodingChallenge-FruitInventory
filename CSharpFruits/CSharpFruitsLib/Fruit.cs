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
            AmountUnit = ParseUnit(amountUnit);
            AmountInGrams = NormalizeWeight(amount, AmountUnit);
        }

        protected static MassUnit ParseUnit(string amountUnit)
        {
            if (!Enum.TryParse(amountUnit, out MassUnit unit))
            {
                throw new ArgumentOutOfRangeException("amountUnit", amountUnit, "Only g and kg are currently supported.");
            }

            return unit;
        }

        protected static decimal NormalizeWeight(decimal amount, MassUnit amountUnit)
            => amount * (int)amountUnit;

        public override string ToString()
        {
            return Name + "\t$" + Price + "\t" + Amount + " " + AmountUnit;
        }
    }
}
