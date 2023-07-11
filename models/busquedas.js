const fs = require('fs');

const axios = require('axios');

class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        //capitalizar cada palabra
        return this.historial.map(lugar =>{

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ')
        })
    }

    get paramsMapBox(){
        return{
            'limit':5,
            'language':'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get paramsOpenWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units:'metric',
            lang:'es'
        }
    }
  
    
    async ciudad(lugar = ''){


        try {
            //Peticion http
            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params:this.paramsMapBox
            });

            const resp = await instancia.get();
            return resp.data.features.map(lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/montevi.json?limit=5&proximity=-73.990593%2C40.740121&types=place%2Cpostcode%2Caddress%2Ccountry%2Clocality&language=es&access_token=pk.eyJ1IjoibWFydGluY2hvMjk2IiwiYSI6ImNsMGswbXE3ZTBoeDkzZW9hajY4c2F4NjUifQ.TtNrXmygEdqtSN3lpQ-Y0Q');

        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon){

        try {
            //Peticion http
            const instancia = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instancia.get();
            const{weather, main} = resp.data;
                return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }; 
        } catch (error) {
            return[];
        }
    }

    agregarHistorial(lugar = ''){

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        //solo mantiene 6 lugares en el historial
        this.historial = this.historial.splice(0,5);
        //prevenir Duplicados
        this.historial.unshift(lugar.toLocaleLowerCase()); //uso unshift envez de push para que e agreguen al principio del array

        //grabar en db
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)){
            return null;
        }
    
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf8' });
        const data = JSON.parse(info);//proceso opuesto a stringify, parsea de string a nuestro array
    
        this.historial = data.historial;
    }
}

module.exports = Busquedas;