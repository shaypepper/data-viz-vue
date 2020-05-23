//requiring path and fs modules
const path = require("path");
const fs = require("fs");
//joining path of directory
const directoryPath = path.join(__dirname, "articles");
//passsing directoryPath and callback function
var csvFile = fs.createWriteStream("first_stab.csv");

csvFile.write("publishDate,eventDate,location\n");

fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  let totalNumberOfEventsWithoutLocations = 0;
  //listing all files using forEach
  files.forEach(function(file) {
    if (file.charAt(0) === ".") return;

    fs.readFile(`articles/${file}`, (err, data) => {
      data
        .toString()
        .split("\n")
        .forEach(function(line, index, arr) {
          const front = line
            .slice(0, 7)
            .match(/[A-Z][a-z]{2} [0-9]{1,2}(?=:)/g);
          if (!front) return;
          const location = getLocation(line) || "";
          const money = getMoney(line) || "";
          const time = getTime(line) || "";
          const description = getDescription(line) || "";
          csvFile.write(
            `${file},${front},${time},${location.replace(/,/g, "") ||
              ""},${money || ""},\"${description}\"\n`
          );
        });
    });
  });
  console.log(totalNumberOfEventsWithoutLocations);
});

function getYear() {}

let places = [
  "Plaza",
  "Waldorf.*?Astoria",
  "Waldorf",
  "Four Seasons",
  "St. Regis",
  "Metropolitan Pavilion",
  "Metropolitan Club",
  "Four Seasons Restaurant",
  "Pierre",
  "Javits Convention Center",
  "Union League Club",
  "Rainbow Room",
  "Mandarin Oriental",
  "Central Park Boathouse",
  "Boathouse Restaurant",
  "Paramount Hotel",
  "Marriott Marquis",
  "Lighthouse at Chelsea Piers",
  "Cipriani 42nd Street",
  "Lincoln Center",
  "Park Avenue Armory",
  "Grand Hyatt",
  "Museum of Modern Art",
  "American Museum of Natural History",
  "Museum of Natural History",
  "Metropolitan Museum of Art",
  "Gotham Hall",
  "Frick",
  "Museum (at|of) the Fashion Institute of Technology",
  "New York Public Library",
  "Visionaire Gallery",
  "Brown's on East 61st Street",
  "1 East 104th Street",
  "New York State Theater",
  "Robert Miller Gallery",
  "Seventh Regiment Armory",
  "New York City Opera thrift shop",
  "LVMH Tower",
  "69th Regiment Armory",
  "200 Fifth Club",
  "Whitney Museum",
  "The New York City Opera",
  "The Chinese Porcelain Company",
  "Metropolitan Museum",
  "Arader Gallery",
  "[Tt]he Russian Tea Room",
  "Puck Building",
  "New York Genealogical Society",
  "James Burden mansion",
  "F. A. O. Schwarz",
  "Tiffany's",
  "Essex House",
  "Sky Club",
  "MetLife Building",
  "City Center",
  "Carnegie Hall",
  "740 Park Avenue",
  "World Financial Center",
  "Fenway Court",
  "Metropolitan Opera",
  "New York City Opera",
  "124 East 58th Street",
  "Broadway Theater Institute",
  "Cipriani on 42nd",
  "Mount Sinai Medical Center",
  "Manhattan Center",
  "Martini's Restaurant and Bar",
  "Avery Fisher Hall",
  "St. John the Divine",
  "Hudson Theater",
  "gardens in the Bronx",
  "Fountain House",
  "Council on Foreign Relations",
  "New-York Historical Society",
  "Pier 60",
  "Nicole's",
  "Grand Central Terminal",
  "East 70th Street",
  "Hilton New York",
  "2 East 79th Street",
  "The Women's Committee of Lighthouse International",
  "Brooklyn Museum",
  "Rockefeller University",
  "El Museo del Barrio",
  "Racquet & Tennis Club",
  "Sotheby's",
  "1-A East 77th Street",
  "Bronx zoo",
  "Juilliard Theater",
  "Tavern on the Green",
  "New York Athletic Club",
  "New York Academy of Sciences",
  "gardens.*?Bronx",
  "Christie's",
  "42nd Street Studios",
  "New York Hilton Hotel",
  "Ace Gallery",
  "Immigration Museum on Ellis Island",
  "Central Park Wildlife Center",
  "Isabella Stewart Gardner", //Boston
  "Parrish Art Museum",
  "Studio Museum in Harlem",
  "Guggenheim",
  "Getty Museum",
  "Museum of Jewish Heritage",
  "Museum of Modern Art",
  "Lighthouse at Chelsea Piers",
  "Rubin Museum of Art",
  "Children's Museum",
  "Museum of the City of New York",
  "Jewish Museum",
  "Morgan Library (and|&) Museum",
  "Cooper Hewitt Museum",
  "Museum of Chinese in America",
  "Museum of Chinese in the Americas",
  "Hermitage Museum", // Russia
  "Gotham Hall",
  "Park Lane Hotel",
  "Museum of Arts and Design",
  "Parrish Art Museum",
  "Museum of Fine Arts, Boston",
  "Cipriani Wall Street",
  "Neue Galerie",
  "Asian Society Museum",
  "Conrad New York",
  "48 Wall Street",
  "Merchant's House Museum",
  "American Folk Art Museum",
  "Fashion Institute of Technology",
  "National.*?Academy",
  "Cooper-Hewitt National Design Museum",
  "New Museum of Contemporary Art",
  "Roseland Ballroom",
  "Freehold, N.J.",
  "National Museum of African American History and Culture",
  "Museum of Television and Radio",
  "Chateau de Blerancourt",
  "Doubles Club",
  "New York-Historical Society",
  "American Craft Museum's",
  "Saratoga Springs, N.Y.",
  "Donna Karan",
  "Madame Tussaud's wax museum",
  "Asia Society Museum",
  "East 67th Street",
  "former estate of Lucie and Walter Rosen",
  "National Museum of the American Indian",
  "11th Avenue and 22nd Street",
  "Mount Vernon Hotel Museum and Gardens",
  "The Dia Art Foundation",
  "home of Frederic Church",
  "Philadelphia Museum of Art",
  "New-York Historical Society",
  "Newark Museum",
  "The Museum at F.I.T.",
  "765 Park Avenue",
  "New York Design Center",
  "583 Park Avenue",
  "3 West 51st Street",
  "Museum for African Art in New York",
  "Old Westbury Gardens",
  "Espace West 42nd Street",
  "7 World Trade Center",
  "National Design Museum",
  "The Museum of Fine Arts in Boston",
  "Hearst Tower",
  "Chelsea Art Museum",
  "Breakers",
  "Bergdorf Goodman",
  "128 East 63rd Street",
  "Studio Museum of Harlem",
  "Guild Hall",
  "Estate of the Lewis Family",
  "American Patrons of Tate",
  "Venetian Theater",
  "Museum for African Art",
  "AXA Equitable Building",
  "central park conservatory garden",
  "church of st. ignatius loyola",
  "saks fifth avenue",
  "barneys new york",
  "st. thomas episcopal church",
  "lord & taylor",
  "ralph lauren",
  "fifth avenue .*?library",
  "jeweler's fifth avenue salon",
  "Gertrude Vanderbilt Whitney Studio",
  "st. patrick's day",
  "easter.*?fifth avenue",
  "564 park avenue",
  "370 park avenue",
  "elie tahari's",
  "the merrin gallery",
  "bryant park",
  "regent wall street",
  "harry winston's fifth avenue salon",
  "sheraton",
  "92nd street y",
  "st. patrick's",
  "racquet and tennis club",
  "grand harmony restaurant",
  "bernarducci meisel gallery",
  "joyce theater",
  "new york botanical garden",
  "edison ballroom",
  "roosevelt hotel",
  "colony club",
  "morgan library",
  "university club",
  "union club",
  "walter reade theater",
  "skylight studio",
  "chelsea piers",
  "housing works thrift shops"
]
  .map(a => a.toLowerCase())
  .join("|");

function getLocation(raw_line) {
  let line = raw_line.toLowerCase();
  let knownLocation = (line.match(places) || [""])[0];
  if (knownLocation) return knownLocation;

  let potentialLocationString =
    line.match(".{1,80}[Aa]venue.{1,20}") ||
    line.match(".{1,50}[sS]treet.{1,30}") ||
    line.match(".{1,100}[mM]useum.{1,100}") ||
    line.match(".{1,50}Central Park.{1,30}") ||
    line.match(".{1,50}[uU]niversity.{1,30}") ||
    line.match(".{1,40}at the.{1,40}") ||
    line.match(".{1,40}in the.{1,40}") ||
    line.match("(?<=: ).{1,50} preview") ||
    line.match(/.*?[^\$][0-9]{1,2}\./);
  // return (potentialLocationString || [""])[0];
  return null;
}

function getMoney(raw_line) {
  let line = raw_line.toLowerCase().replace(/,/g, "");
  let moneyString = line.match(/\$[0-9\.]* million/) || line.match(/\$[0-9]*/);
  return (moneyString || [""])[0];
}

function getTime(line) {
  let timeString = line.match(/[0-9]{1,2}:[0-9]{2}/);
  return (timeString || [""])[0];
}

function getDescription(raw_line) {
  const line = raw_line.replace(/"/g, "'").trim();
  const description =
    line.match(/(?<=([A-Za-z]{3} [0-9]{1,2}: )).*?(?=( [0-9]{1,2}\. ))/) ||
    line.match(".*");

  return (description || [""])[0];
}
