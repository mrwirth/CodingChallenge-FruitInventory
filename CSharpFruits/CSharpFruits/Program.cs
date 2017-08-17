using System;
using System.Configuration;
using System.Linq;
using CSharpFruitsLib;

// Problem definition at
// https://resonant-shoulder.glitch.me/

namespace CSharpFruits
{
    class Program
    {
        static void Main(string[] args)
        {
            var dataUrl = ConfigurationManager.AppSettings["variedFruitsWidthsAndOrderSource"];
            var rawData = FetchData(dataUrl);
            var fruits = 
                Fruits.ParseTable(rawData)
                .DistinctBy(x => x.Name)
                .Where(x => x.Price >= 30.00m)
                .OrderByDescending(x => x.AmountInGrams);
            foreach (var fruit in fruits)
            {
                // Slight cheating here: I know the length of the longest fruit name,
                // so I'm padding by enough to make the console output easy to read.
                Console.WriteLine($"{fruit.Name,20}\t${fruit.Price:#,0.00#}\t{fruit.Amount:#,0.00#} {fruit.AmountUnit}");
            }
            Console.ReadLine();
        }

        private static string FetchData(string url)
        {
            using (var client = new System.Net.WebClient())
            {
                return client.DownloadString(url);
            }
        }
    }
}
