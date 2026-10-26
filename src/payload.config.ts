import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { vi } from '@payloadcms/translations/languages/vi'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Categories, Products, Inspirations } from './collections/Catalog'
import { Media } from './collections/Media'
import { Store, Policies } from './globals/Settings'
import { Website } from './globals/Website'
import { privateBlobAdapter } from './lib/privateBlob'
const dirname=path.dirname(fileURLToPath(import.meta.url))
export default buildConfig({
 secret:process.env.PAYLOAD_SECRET||'',
 serverURL:process.env.NEXT_PUBLIC_SERVER_URL||(process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:'http://localhost:3000'),
 admin:{user:'users',importMap:{baseDir:dirname},meta:{titleSuffix:' · Trung Béo Luxury'},components:{graphics:{Logo:'/components/Logo#default',Icon:'/components/Logo#default'},beforeDashboard:['/components/AdminWelcome#default']},autoLogin:false},
 i18n:{supportedLanguages:{vi},fallbackLanguage:'vi'},
 localization:{locales:[{label:'Tiếng Việt',code:'vi'},{label:'Tiếng Anh',code:'en'}],defaultLocale:'vi',fallback:false},
 collections:[Users,Categories,Products,Inspirations,Media],globals:[Website,Store,Policies],
 db:postgresAdapter({pool:{connectionString:process.env.DATABASE_URL,max:3},schemaName:'cms',push:false,migrationDir:path.resolve(dirname,'migrations')}),
 plugins:[cloudStoragePlugin({collections:{media:{adapter:privateBlobAdapter,prefix:'media',disableLocalStorage:true}},useCompositePrefixes:true})],
 sharp,
 typescript:{outputFile:path.resolve(dirname,'payload-types.ts')},
 email:()=>({name:'disabled-until-provider-configured',defaultFromAddress:'noreply@example.invalid',defaultFromName:'Trung Béo Luxury',sendEmail:async()=>{throw new Error('Email hệ thống chưa được cấu hình. Vui lòng liên hệ chủ cửa hàng.')}}),
 graphQL:{disable:true},
 upload:{limits:{fileSize:4*1024*1024}},
 endpoints:[],
})
