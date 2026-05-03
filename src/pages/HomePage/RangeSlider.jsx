import { Label, Slider } from "@heroui/react";

export default function RangeSlider({minValue, maxValue, step=1, label, value, onChange}) {
    return (
        <Slider
            className="w-full max-w-xs"
            defaultValue={[minValue, maxValue]}
            // formatOptions={{ currency: "USD", style: "currency" }}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            aria-label={label}
            value={value}
            onChange={onChange}
        >
            {/* <Label>Price Range</Label> */}
            {/* <Slider.Output /> */}

            {/* Couldn't find the correct format to show numbers without comma seperator, so
                Added custom JSX to show the seleccted range output    */}
            <div className="text-foreground font-semibold text-right">
                {value?.[0]} - {value?.[1]}
            </div>

            <Slider.Track>
                {({ state }) => (
                    <>
                        <Slider.Fill/>
                        {state.values.map((_, i) => (
                            <Slider.Thumb key={i} index={i} />
                        ))}
                    </>
                )}
            </Slider.Track>
        </Slider>
    );
}