import { BlockPlugin } from "@kishtarn/mcboilerplate";

type sideMode = "optional" | "show" | "hide";
interface LichenLikeOptions {
    north?: sideMode
    south?: sideMode
    east?: sideMode
    west?: sideMode
    down?: sideMode
    up?: sideMode
};

export const LichenLikeBlock =(options: LichenLikeOptions): BlockPlugin => (target)=> {    
    const north = options.north ?? "optional"
    const east = options.east ?? "optional"
    const south = options.south ?? "optional"
    const west = options.west ?? "optional"
    const down = options.down ?? "optional"
    const up = options.up ?? "optional"

    if (north === "optional") target.setState("cc:n", [false, true]);
    if (east === "optional") target.setState("cc:e", [false, true]);
    if (south === "optional") target.setState("cc:s", [false, true]);
    if (west === "optional") target.setState("cc:w", [false, true]);
    if (down === "optional") target.setState("cc:b", [false, true]);
    if (up === "optional") target.setState("cc:t", [false, true]);
    target.setComponent(
        "minecraft:geometry", 
        {
            identifier: "geometry.cc_lichen",
            bone_visibility: {
                "north": north === "optional" ? "q.block_state('cc:n')" : north === "show",
                "east": east === "optional" ? "q.block_state('cc:e')" : east === "show",
                "south": south === "optional" ? "q.block_state('cc:s')" : south === "show",
                "west": west === "optional" ? "q.block_state('cc:w')" : west === "show",
                "down": down === "optional" ? "q.block_state('cc:b')" : down === "show",
                "up": up === "optional" ? "q.block_state('cc:t')" : up === "show",
            }
        }
    )
    .setComponent("minecraft:collision_box", false)
    .setComponent("minecraft:light_dampening", 0)
    .setComponent("minecraft:replaceable", {})

    ;

}