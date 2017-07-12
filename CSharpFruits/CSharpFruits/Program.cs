using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CSharpFruitsLib;

// Problem definition at
// https://salty-impulse.glitch.me/

namespace CSharpFruits
{
    class Program
    {
        static void Main(string[] args)
        {
            var dataUrl = ConfigurationManager.AppSettings["dataUrl"];
            var fruits = from fruit in Fruits.GetFruits(dataUrl).DeduplicateBy(x => x.Name)
                         where fruit.AmountInGrams > 750
                         orderby fruit.Price descending
                         select fruit;
            foreach (var fruit in fruits)
            {
                Console.WriteLine($"{fruit.Name}\t${fruit.Price:#,0.00#}\t{fruit.Amount:#,0.00#} {fruit.AmountUnit}");
            }
            Console.ReadLine();
        }
    }
}
