// JavaScript Object
const person = {
    name: "Alice",
    age: 30,
    profession: "Developer"
  };
  
  // Adding and updating properties
  person.city = "New York";
  person.age = 31;
  
  // JavaScript Map
  const userMap = new Map();
  
  userMap.set("name", "Bob");
  userMap.set("age", 28);
  userMap.set("profession", "Designer");
  userMap.set("city", "San Francisco");
  
  // Display Object
  const objectOutput = document.getElementById("objectOutput");
  objectOutput.textContent = JSON.stringify(person, null, 2);
  
  // Display Map
  const mapOutput = document.getElementById("mapOutput");
  let mapString = "";
  userMap.forEach((value, key) => {
    mapString += `${key}: ${value}\n`;
  });
  mapOutput.textContent = mapString;
  