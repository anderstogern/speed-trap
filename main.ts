function getDistance () {
    pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
    pins.digitalWritePin(DigitalPin.P0, 0)
    control.waitMicros(2)
    pins.digitalWritePin(DigitalPin.P0, 1)
    control.waitMicros(10)
    pins.digitalWritePin(DigitalPin.P0, 0)
    return pins.pulseIn(DigitalPin.P1, PulseValue.High) * 0.026881720430108
}
function getSpeed () {
    td = 500000
    d0 = getDistance()
    control.waitMicros(td)
    d1 = getDistance()
    d = d0 - d1
    serial.writeValue("d", d)
    // serial.writeValue("d0", d0)
    // serial.writeValue("d1", d1)
    return d * 0.036 * (1000000 / td)
}
let timeout = 0
let v = 0
let d = 0
let d1 = 0
let d0 = 0
let td = 0
max7219_7segment.setup(
1,
DigitalPin.P14,
DigitalPin.P15,
DigitalPin.P16,
DigitalPin.P13
)
max7219_7segment.fillAll()
control.waitMicros(1000000)
max7219_7segment.clearAll()
basic.forever(function () {
    v = getSpeed()
    if (v > 2) {
        max7219_7segment.clearAll()
        max7219_7segment.displayNumber(v)
        timeout = control.millis()
    }
    if (control.millis() - timeout > 5000) {
        max7219_7segment.clearAll()
    }
})
