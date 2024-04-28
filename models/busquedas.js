const fs = require('fs')
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = './db/db.json'

  constructor() {
    this.leerDB()
  }

  get historialCapitalizado(){
    return this.historial.map( lugar=>{

        let palabras = lugar.split(' ')
        palabras = palabras.map(p=> p[0].toUpperCase() + p.substring(1))
        return palabras
    })
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      apikey: process.env.OPENWEATHER,
      lang: "es",
      units:"metric"
    };
  }

  async ciudad(lugar = "") {
    // peticion https
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/search/geocode/v6/forward?q=${lugar}`,
        params: this.paramsMapbox
      });

     const resp = await instance.get();
     
     return resp.data.features.map( ( { id , properties } ) => ({
        id: id,
        nombre: properties.name,
        direccion:properties.full_address,
        lng: properties.coordinates.longitude,
        lat: properties.coordinates.latitude
    }));
    
    } catch (error) {
      return [];
    }
  }

  async climaLugar( lat, lon){
    try{
        // instance 
        const instance = axios.create({
            baseURL:`https://api.openweathermap.org/data/2.5/weather`,
            params: { ...this.paramsOpenWeather, lat, lon }
        })
        const resp = await instance.get()

        const { weather, main } = resp.data || {}

        return {
            desc: weather[0].description,
            temp: main.temp,
            min:  main.temp_min,
            max:  main.temp_max
        }
    }catch(err){
        console.log(err);
    }
  }

  agregarHistorial( lugar = '' ){
    if(this.historial.includes( lugar.toLocaleLowerCase() )) return
    
    this.historial = this.historial.splice(0,5)
    this.historial.unshift( lugar.toLocaleLowerCase() )
    this.guardarDB()
  }

  guardarDB(){
    const payload = {
        historial:this.historial
    }
    fs.writeFileSync(this.dbPath,JSON.stringify( payload ))
  }

  leerDB(){
    if(fs.existsSync(this.dbPath)){
        let data = fs.readFileSync(this.dbPath,
            { encoding: 'utf-8', flag: 'r' })
        this.historial = JSON.parse(data).historial
    }
    
  }
}

module.exports = Busquedas;
