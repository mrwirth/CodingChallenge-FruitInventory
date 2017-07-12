# Test Your Mettle: Fruits Edition

## Abstract
Write a program that loads a text file with fruit inventory data, processes it, and displays the results on screen.

## Requirements

### General requirements
Try to write your solution in a professional manner, not like a one-off script.  As this is an interview problem you can create a more complex solution than the problem requires in order to demonstrate your knowledge and skill.  However, keep in mind that working and simple is far better than complex and broken.

### Specific requirements
* Fetch the data from one of the data sources listed below.  You should start with the static data, and then if possible make sure your solution also works on the dynamic data source.
    * Focus on the static data: getting your solution to work with the dynamic data source is extra credit, but failing to get it working with the static data will count against you.
* Deduplicate the fruits by keeping only the first occurence of each fruit.
* Filter the fruits by removing all fruit with a price less than $1.
* Sort the fruits by quantity, from most to least.

## Data sources
* Static sample: [https://resonant-shoulder.glitch.me/sample-data.txt](https://resonant-shoulder.glitch.me/sample-data.txt)
* Dynamic data: [https://resonant-shoulder.glitch.me/dynamic-data.txt](https://resonant-shoulder.glitch.me/dynamic-data.txt)

## Notes on data quality and variety
* You can assume the data was input manually, so there may be extra or missing spaces within a column. However, columns will align vertically.
* The only mass units involved will be grams and kilograms, in the form of the standard abbreviations `g` and `kg`.
* Price will always be in dollars ($).