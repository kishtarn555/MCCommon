import { BlockPlugin } from "@kishtarn/mcboilerplate";

type sideMode = "optional" | "show" | "hide" | "ignore";
interface LichenLikeOptions {
    north?: sideMode
    south?: sideMode
    east?: sideMode
    west?: sideMode
    down?: sideMode
    up?: sideMode
    unreplaceable?: boolean
    selectionBoxSize?: number
    customModelIdentifier?: string,
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
    const getBoneVisibility = (name: string, option : sideMode) => {
        if (option === "show") {
            return true;
        }
        if (option === "optional") {
            return `q.block_state('${name}')`;
        }
        if (option === "hide") {
            return false;
        }
        return undefined;
    }
    target.setComponent(
        "minecraft:geometry", 
        {
            identifier: options.customModelIdentifier ?? "geometry.cc_lichen",
            bone_visibility: {
                "north": getBoneVisibility('cc:n', north),
                "east": getBoneVisibility('cc:e', east),
                "south": getBoneVisibility('cc:s', south),
                "west": getBoneVisibility('cc:w', west),
                "down": getBoneVisibility('cc:b', down),
                "up": getBoneVisibility('cc:t', up),
            }
        }
    )
    .setComponent("minecraft:collision_box", false)
    .setComponent("minecraft:light_dampening", 0);

    if (!options.unreplaceable) target.setComponent("minecraft:replaceable", {});
    let permutations: { condition: string,components: Partial<any>}[] = []
    for (const n  of (north === "optional"?[false, true]: [north]))
    for (const e  of (east === "optional"?[false, true]: [east])) 
    for (const s  of (south === "optional"?[false, true]: [south])) 
    for (const w  of (west === "optional"?[false, true]: [west])) 
    for (const b  of (down === "optional"?[false, true]: [down])) 
    for (const t  of (up === "optional"?[false, true]: [up])) {
        const targetState = {n,e,s,w,b,t};
        let query: string = 
            Object.entries(targetState)
            .filter(([_, value])=> typeof value === "boolean")
            .map(
                ([key, value])=> `${value? "": "!"}q.block_state('cc:${key}')`
            ).join(" && ");
        
        const targetValues = 
            Object.entries(targetState)
            .reduce((prev, [key, val]) => ({...prev, [key]: (typeof val === "boolean"? val:  val === "show")}), {} as {[key in keyof typeof targetState]: boolean});
        const trueKeys = Object.entries(targetValues)
            .filter(([_, v]) => v)
            .map(([k]) => k);

        const result = trueKeys.length === 1 ? trueKeys[0] : "all";
        let box;
        const selectionBoxSize = options.selectionBoxSize ?? 1;
        
        switch (result) {
        case "b":
            box = { origin: [-8, 0, -8], size: [16, selectionBoxSize, 16] };
            break;
        case "t":
            box = { origin: [-8, 16-selectionBoxSize, -8], size: [16, selectionBoxSize, 16] };
            break;
        case "n":
            box = { origin: [-8, 0, 8-selectionBoxSize], size: [16, 16, selectionBoxSize] };
            break;
        case "s":
            box = { origin: [-8, 0, -8], size: [16, 16, selectionBoxSize] };
            break;
        case "e":
            box = { origin: [8-selectionBoxSize, 0, -8], size: [selectionBoxSize, 16, 16] };
            break;
        case "w":
            box = { origin: [-8, 0, -8], size: [selectionBoxSize, 16, 16] };
            break;
        case "all":
            box = { origin: [-8, 0, -8], size: [16, 16, 16] };
            break;
        default:
            box = { origin: [-5, 3, -5], size: [10, 10, 10] };
            break;
        }

        permutations.push({
            condition: query,
            components: {
                "minecraft:selection_box": box
            }


        })
    }

    if (permutations.length === 1 && target.permutations.length === 0) {
        target.setComponent(
            "minecraft:selection_box", 
            permutations[0].components["minecraft:selection_box"]
        );
    } else {
        target.setCustomComponent("cc:lichen_like", {});
         if (target.permutations.length === 0) {
        target.permutations = permutations;
        } else {
            target.permutations = target.permutations.flatMap((perm)=> permutations.map(lichenPerm=> ({
                condition: lichenPerm.condition !== "" ? `(${perm.condition}) && ${lichenPerm.condition}` : perm.condition,
                components: {
                    ...perm.components,
                    ...lichenPerm.components
                }
            })));
        }
    }

}