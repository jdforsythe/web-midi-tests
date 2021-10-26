"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
const api_1 = require("./api");
const driving_1 = require("./driving");
const encoder_1 = require("./encoder");
const power_1 = require("./power");
const something_api_1 = require("./something-api");
const system_info_1 = require("./system-info");
const sensor_1 = require("./sensor");
const types_1 = require("./types");
const user_io_1 = require("./user-io");
const sequencer = () => {
    let s = 0;
    return () => {
        const temp = s;
        s += 1;
        if (s >= 255) {
            s = 0;
        }
        return temp;
    };
};
const factory = (seq) => {
    const getSequence = seq || sequencer();
    const gen = (deviceId) => (part) => (0, encoder_1.encode)(Object.assign(Object.assign({}, part), { commandFlags: [types_1.Flags.requestsResponse, types_1.Flags.resetsInactivityTimeout], deviceId, sequenceNumber: getSequence() }));
    return {
        api: (0, api_1.default)(gen),
        driving: (0, driving_1.default)(gen),
        power: (0, power_1.default)(gen),
        somethingApi: (0, something_api_1.default)(gen),
        systemInfo: (0, system_info_1.default)(gen),
        userIo: (0, user_io_1.default)(gen),
        sensor: (0, sensor_1.default)(gen),
    };
};
exports.factory = factory;
