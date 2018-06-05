$(function() {

  var getPosition = new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(success, error);
    function error(err) {
        reject(error);
    }
    function success(pos) {
        resolve({longitude: pos.coords.longitude, latitude: pos.coords.latitude});
    }
  });
  function getData(longitude, latitude) {
     return new Promise(function (resolve,reject) {
         $.ajax({
             url: "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=bd464f022c0e7940baf1a3fba95df8b2&units=metric"
         }).done(function (data) {
             resolve(data)
         }).fail(function (err) {
             reject(err);
         })
     })
  };
  getPosition.then(
     function (result) {
         return getData(result.longitude, result.latitude);
     }
  )
     .then(
         function (users) {
           var city = $("<h2>", { text: users.name });
           var description = $("<p>", { text: users.weather["0"].description });
           var topLeft = $('<div>', { id:'topLeft'}).append(city).append(description);
           var topSection = $('<div>', { id:'topSection'}).appendTo("#weatherWidget");
           var icon = $('<div>', { id:'icon'}).append($("<img>", { src: "http://openweathermap.org/img/w/"+users.weather["0"].icon+".png" }));
           topSection.append(topLeft).append(icon);

           var main = $('<div>', { id:'main'}).appendTo("#weatherWidget");
           var left = $('<div>', { id:'left'}).appendTo("#main");
           var temperature = $("<p>", { text: Math.round(users.main.temp) + "°C"});
           left.append(temperature);

           var right = $('<div>', { id:'right'}).appendTo("#main");
           var details = $("<h2>", { text: "Details"});
           var windLine = $("<p>", { text: "Wind"});
           var wind = $("<span>", { text: users.wind.speed + "m/s"}).appendTo(windLine);
           var humidityLine = $("<p>", { text: "Humidity"});
           var humidity = $("<span>", { text: users.main.humidity + "%"}).appendTo(humidityLine);
           var pressureLine = $("<p>", { text: "Pressure"});
           var pressure = $("<span>", { text: users.main.pressure + "hPa"}).appendTo(pressureLine);
           right.append(details).append(windLine).append(humidityLine).append(pressureLine);

           var bottomSection = $('<div>', { id:'bottomSection'}).appendTo("#weatherWidget");
           var time = $("<p>", { text: moment().format('llll')});
           bottomSection.append(time);
         }
  )
     .catch(function (error) {
     console.log(alert(error.message + ' ' + error.code));
  });

});
