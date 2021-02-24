function getDistance () {
    pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
    pins.digitalWritePin(DigitalPin.P0, 0)
    control.waitMicros(2)
    pins.digitalWritePin(DigitalPin.P0, 1)
    control.waitMicros(10)
    pins.digitalWritePin(DigitalPin.P0, 0)
    // 0.026881720430108
    return pins.pulseIn(DigitalPin.P1, PulseValue.High) / 37
}
function getSpeed (td: number, ts: number) {
    d0 = getDistance()
    control.waitMicros(td)
    d1 = getDistance()
    d = d0 - d1
    serial.writeValue("d0", d0)
    serial.writeValue("d1", d1)
    serial.writeValue("d", d)
    return d * 0.036 * ts
}
let timeout = 0
let v = 0
let d = 0
let d1 = 0
let d0 = 0
let ts = 0
let td = 1000000
ts = 1000000 / td
max7219_7segment.setup(
4,
DigitalPin.P14,
DigitalPin.P15,
DigitalPin.P16,
DigitalPin.P13
)
max7219_7segment.brightnessAll(15)
max7219_7segment.fillAll()
control.waitMicros(1000000)
max7219_7segment.clearAll()
basic.forever(function () {
    v = getSpeed(td, ts)
    serial.writeValue("v", v)
    if (v > 2) {
        max7219_7segment.clearAll()
        max7219_7segment.displayNumber(v)
        timeout = control.millis()
    }
    if (timeout > 0 && control.millis() - timeout > 5000) {
        max7219_7segment.clearAll()
        timeout = 0
    }
    control.waitMicros(100000)
})
