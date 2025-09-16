import fs from "fs";
import path from "path";
import {ProjectDefinition, ProjectManager, TranslatableEntity} from "@kishtarn/mcboilerplate"

const PackageNameBP: TranslatableEntity = {
    translationKey: 'mccommon.package.bp_name',
    translations: {
        en_US: 'MC common features BP',
        es_MX: 'MC características comunes BP'
    }
}
const PackageDescription: TranslatableEntity = {
    translationKey: 'mccommon.package.description',
    translations: {
        en_US: 'Adds common features used by multiple addons',
        es_MX: 'Agrega multiples características usadas por multiples addons'
    }    
}


const PackageNameRP: TranslatableEntity = {
    translationKey: 'mccommon.package.rp_name',
    translations: {
        en_US: 'MC common features RP',
        es_MX: 'MC características comunesRP'
    }
}

const definition:ProjectDefinition = {
    behaviourDependsOnResource: true,
    version: [1,0,0],
    min_engine_version: [1, 21, 100],
    behaviour: {
        name: PackageNameBP,
        description: PackageDescription,
        uuid: '834dcd3f-f9d2-457e-b6ef-ed59b9ad921f',
        data_uuid: '22b6a142-383c-4017-859e-a8da1007e80e',
        script_uuid: '49199e9a-1c50-4d3a-99e7-591b9a3cee9e'
    },
    resource: {
        name: PackageNameRP,
        description: PackageDescription,
        uuid: '25b4649e-e246-4902-8ed8-29185c7fc4be',
        resource_uuid: '8ef107c8-3ca8-4abb-af37-adcd653d13d2'
    }
    
}

const manager = new ProjectManager(
    'mccommon',
    definition
);

manager.addTranslation(PackageNameBP);
manager.addTranslation(PackageNameRP);
manager.addTranslation(PackageDescription);



const outputDir = path.resolve(process.cwd(), "output");


// 🔹 1. Clear output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 🔹 2. Generate files
for (const { relativePath, content } of manager.generateFiles()) {
  const filePath = path.join(outputDir, relativePath);

  // make sure directories exist
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // write file
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ Generated: ${filePath}`);
}