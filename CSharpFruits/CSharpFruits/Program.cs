﻿using System;
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
            var fruits = Fruits.GetFruits(dataUrl);
        }
    }
}
