import { writeFile, readFile, mkdir } from 'node:fs/promises';
// Vector drawables keep the Android package self-contained, with no image tooling in CI.
const base='android/app/src/main/res';
await mkdir(base+'/drawable',{recursive:true});
await writeFile(base+'/drawable/wellye_foreground.xml',`<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><path android:fillColor="#AE82FF" android:pathData="M22,32L33,77L45,77L54,51L63,77L75,77L86,32L72,32L67,59L59,32L49,32L41,59L36,32Z"/><path android:fillColor="#B8E4C1" android:pathData="M86,22m-3,0a3,3 0,1 0,6 0a3,3 0,1 0,-6 0"/></vector>`);
await writeFile(base+'/drawable/wellye_background.xml','<shape xmlns:android="http://schemas.android.com/apk/res/android"><solid android:color="#141020"/></shape>');
await writeFile(base+'/drawable/wellye_icon.xml','<layer-list xmlns:android="http://schemas.android.com/apk/res/android"><item android:drawable="@drawable/wellye_background"/><item android:drawable="@drawable/wellye_foreground"/></layer-list>');
await mkdir(base+'/mipmap-anydpi-v26',{recursive:true});
const adaptive='<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@drawable/wellye_background"/><foreground android:drawable="@drawable/wellye_foreground"/></adaptive-icon>';
for(const f of ['ic_launcher.xml','ic_launcher_round.xml'])await writeFile(base+'/mipmap-anydpi-v26/'+f,adaptive);
let manifest=await readFile('android/app/src/main/AndroidManifest.xml','utf8');manifest=manifest.replace('@mipmap/ic_launcher"','@drawable/wellye_icon"').replace('@mipmap/ic_launcher_round"','@drawable/wellye_icon"');
if(!manifest.includes('android.permission.POST_NOTIFICATIONS'))manifest=manifest.replace('</manifest>','<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/></manifest>');
await writeFile('android/app/src/main/AndroidManifest.xml',manifest);
