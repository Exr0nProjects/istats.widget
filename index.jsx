/**
 * Copyright 2019 Roland Schaer, Exr0n
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { React } from 'uebersicht';

import Error from './src/components/Error.jsx';
import Stats from './src/components/Stats.jsx';

/**
 * Configuration values
 */
const config = {
    _weather_data: {prev_timestamp: 0 }, // TODO: this is terrible practice
    /* Enable animations */
    animations: true,
    /* Available stat keys, in order of rendering */
    stats: [
        { 'title': 'time-of-day',
            'is_custom': true,
            'key': 'time-of-day',
            'percentage': () => {
                const dt = new Date();
                const secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
                return Math.round(secs/24/60/60*100);
            },
            'text': () => {
                const dt = new Date();
                return `${String(dt.getHours()).padStart(2)}:${String(dt.getMinutes()).padStart(2, '0')}`;
            },
            'icon': 'icon-clockalt-timealt',
            'lowcolor': [0xcc, 0xcc, 0xcc],
            'highcolor': [0xcc, 0xcc, 0xcc]
        },
        { 'title': 'weather-temp',
            'is_custom': true,
            'key': 'weather-temp',
            'percentage': () => {
                const key = require('./secrets.json').weatherkey;
                if (Date.now() - config._weather_data.prev_timestamp > 1000*600) {
                    navigator.geolocation.getCurrentPosition(pos => {
                        config._weather_data.prev_timestamp = Date.now();
                        const c = pos.position.coords;
                        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${c.latitude}&lon=${c.longitude}&APPID=${key}`)
                            .then(res => res.json())
                            .then(json => { config._weather_data.prev_value = json })
                            .then(() => console.log(config._weather_data.prev_value))
                            .catch(console.error);
                    });
                }
                return config._weather_data.prev_value ? (config._weather_data.prev_value.list[0].main.temp-273.15)*2 : 0;
            },
            'text': () => '' + (config._weather_data.prev_value ? Math.floor((config._weather_data.prev_value.list[0].main.temp-273.15)*9/5+32) : 0) + 'ºF',
            'icon': () => {
                if (!config._weather_data.prev_value) return 'icon-sun-day';
                // TODO: untested... some icons may not work properly
                switch (config._weather_data.prev_value.list[0].weather[0].main) {
                    case 'Thunderstorm': return 'icon-lightningalt';
                    case 'Rain':
                    case 'Drizzle': return 'icon-rain';
                    case 'Snow': return 'icon-snow';
                    case 'Clouds': return 'icon-cloud';
                    case 'Clear': return 'icon-sun-day';
                }
                return 'icon-warning-sign';
            },
            'highcolor': [255, 0, 0],
            'lowcolor': [0, 0, 255],
        },
        'cpu.cpu-temp',
        'extra.tcgc-peci-gpu-temp',
        'fan.fan-0-speed',
        'fan.fan-1-speed',
        'battery.current-charge'
    ],
    /* Temperature unit, either 'C' or 'F' */
    tempUnit: 'F',
    /* Widget position */
    position: 'top-left',
    top: '900px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    /* Stat position */
    width: '72',
    height: '40',
    radius: '18',
    strokeWidth: '2',
    /* Stat  color */
    gradient: true, // whether to enable the automated gradient. Overrides color when true
    color: '#ccc',
    /* Stat icon sizes */
    iconSize: '1.0rem',
    iconLineHeight: '2.5rem',
    /* Stat label size */
    labelSize: '0.625rem'
};

/**
 * Widget command
 */
export const command = '/usr/local/bin/istats';

/**
 * Widget refresh frequency in milliseconds
 */
export const refreshFrequency = 1000;

export const className = `
    width: 100%;
    height: 100%;
    font-family: 'Helvetica Neue';
    font-size: 16px;
    color: ${config.color};
`;

const isEmpty = (value) => {
    return (!value || Object.keys(value).length === 0 && (value).constructor === Object);
}

const renderError = (error) => {
    if (isEmpty(error)) return ('');
    return <Error error={error} />
}

const renderStats = (output) => {
    if (isEmpty(output)) return ('');
    return <Stats output={output} config={config} />
};

export const render = ({output, error}) => {
    return error ? renderError(error) : renderStats(output);
};
