import gulp from "gulp";
import os from "os";
import { deleteAsync } from "del"; // <- new API


const bpfoldername = "mccommon";
const useMinecraftPreview = true; // Whether to target the "Minecraft Preview" version of Minecraft vs. the main store version of Minecraft
const useMinecraftDedicatedServer = false; // Whether to use Bedrock Dedicated Server - see https://www.minecraft.net/download/server/bedrock
const dedicatedServerPath = "C:/mc/bds/1.19.0/"; // if using Bedrock Dedicated Server, where to find the extracted contents of the zip package

const mcdir = useMinecraftDedicatedServer
  ? dedicatedServerPath
  : os.homedir() +
  (useMinecraftPreview
    ? "/AppData/Roaming/Minecraft Bedrock Preview/Users/Shared/games/com.mojang/"
    : "/AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang/");


async function clean_localmc() {
  if (!bpfoldername || bpfoldername.length < 2) {
    console.log("No bpfoldername specified.");
    return;
  }

  await deleteAsync([
    mcdir + "development_behavior_packs/" + bpfoldername,
    mcdir + "development_resource_packs/" + bpfoldername
  ], { force: true });
}

function deploy_localmc_behavior_packs() {
  console.log("Deploying to '" + mcdir + "development_behavior_packs/" + bpfoldername);
  return gulp
    .src(["output/behaviourpack/**/*"], { encoding:false})
    .pipe(gulp.dest(mcdir + "development_behavior_packs/" + bpfoldername));
}

function deploy_localmc_resource_packs() {
  return gulp
    .src(["output/resourcepack/**/*"],  { encoding:false})
    .pipe(gulp.dest(mcdir + "development_resource_packs/" + bpfoldername));
}

// 🔹 Copy static files into output/behaviourpack
function copy_static_behavior() {
  return gulp
    .src(["resources/behaviourpack/**/*"], { encoding: false })
    .pipe(gulp.dest("output/behaviourpack"));
}

// 🔹 Copy static files into output/resourcepack
function copy_static_resource() {
  return gulp
    .src(["resources/resourcepack/**/*"], { encoding: false })
    .pipe(gulp.dest("output/resourcepack"));
}

const build_output = gulp.parallel(copy_static_behavior, copy_static_resource);



const deploy_localmc = gulp.series(
  clean_localmc,
  build_output, // 🔹 copy statics into output before deploy
  gulp.parallel(deploy_localmc_behavior_packs, deploy_localmc_resource_packs)
);
export default deploy_localmc;
