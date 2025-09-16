
import { system } from "@minecraft/server";

const OPEN_STATE = "cc:open_bit"


class OpenableComponent {
    onPlayerInteract (arg, p) {
        const block = arg.block;
        const bit = block.permutation.getState(OPEN_STATE);
        const params = p.params ;
        const sound = bit ?   params.closeSound : params.openSound ;
        if (sound) {
            block.dimension.playSound(sound, block.location);
        }
        block.setPermutation( block.permutation.withState(OPEN_STATE, !bit))
    }
}

system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('cc:openable', new OpenableComponent());
});