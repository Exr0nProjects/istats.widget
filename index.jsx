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
    /* Enable animations */
    animations: true,
    /* Available stat keys, in order of rendering */
    stats: [
        {
            'is_custom': true,
            'title': 'time-of-day',
            'key': 'time-of-day',
            'percentage': () => {
                const dt = new Date();
                const secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
                return Math.round(secs/24/60/60*100);
            },
            'text': () => {
                const dt = new Date();
                return `${dt.getHours()}:${dt.getMinutes()}`;
            },
            'icon': 'icon-clockalt-timealt',
            'lowcolor': [0xcc, 0xcc, 0xcc],
            'highcolor': [0xcc, 0xcc, 0xcc]
        },
        {
            'is_custom': true,
            'title': 'weather-temp',
            'key': 'weather-temp',
            'percentage': () => {
                const key = require('../../secrets.json').weatherkey'17643c253bde82aeec5bdf6cd7e0e661';
            },
            'text': () => 'howdy',
            'icon': () => 'icon-clockalt-timealt',
            'highcolor': [0, 0, 0],
            'lowcolor': [0, 0, 0],
            'prev_timestamp': 0
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
