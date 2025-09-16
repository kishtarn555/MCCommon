import { ExtensionProject  } from "@kishtarn/mcboilerplate";
import trapdoorBlock from "./trapdoor/trapdoor.geo.json" with { type: "json" };


export class MCCommonExtension extends ExtensionProject {
    constructor () {
        super();
        this.name ="mccommon";
        this.code="";
    }

    files: () => Generator<{ relativePath: string; content: string; }> = function*() {
        yield {
            relativePath:"resourcepack/models/mccommon.trapdoor.geo.json",
            content: JSON.stringify(trapdoorBlock)
        };
    }
}

