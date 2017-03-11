import mongodb = require('mongodb')

interface Spaces {
  available: boolean
  latitude: number
  longitude: number
  name: string
  serial?: string
  rate: [number, number]
  managedBy?: string
}

function randomString(length: number, chars: string) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function randomSpaces(): Spaces {
  let latitude: number = 24.063891539189012
  let longitude: number = 120.54062280938389

  let manage: string[] = ["彰化縣政府", "台中市政府", "彰化師範大學", "私人"]
  let manageSer: string[] = ["CH", "TCGOV", "NCUE", "private"]
  let manageID: string[] = ["589805d2aa338e21da331530", "578895d2ac338e21da342529", "667305e2aa338e21dn085634", "129805d2aa338e21da075461"]
  let randManagerInt: number = Math.floor(Math.random() * 4)

  let nameArr: string[] = ["中正路一段", "中山路一段", "中山路二段", "仁愛路", "金馬路", "民族路"]
  let randNameInt: number = Math.floor(Math.random() * 6)
  let nameSer: string[] = ["CC", "CH", "CH", "RI", "KM", "MZ"]
  let randSerInt: number = Math.floor(Math.random() * 6)

  let randSerStr = randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  let randName: number = Math.floor(Math.random() * 3)

  return {
    available: Math.random() > 0.5,
    latitude: latitude + Math.random() / 100,
    longitude: longitude + Math.random() / 100,
    name: nameArr[randNameInt] + " " + (Math.floor(Math.random() * 100) + 1).toString() + randomString(1, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    // serial: manageSer[randManagerInt] + '-' + nameSer[randNameInt] + '-' + randSerStr,
    rate: [(Math.floor(Math.random() * 10) + 1), (Math.floor(Math.random() * 20) + 1) * 100],
    // managedBy: manage[randManagerInt]
  }
}

export async function createRandom(db: mongodb.Db, count: number) {
  let random: Spaces[] = []
  for (let i = 0; i < count; ++i) {
    random.push(randomSpaces())
  }
  let result = await db.collection('spaces').insert(random)
  await db.collection('spaces').createIndex({ latitude: 1, longitude: 1 })

  return result
}

async function run() {
  try {
    let client = new mongodb.MongoClient()
    let dbUri = process.env.MONGODB_URI
    let db = await client.connect('mongodb://heroku_d2g7rtth:4411ul6akmdnbnuoruchjr1gk4@ds143559.mlab.com:43559/heroku_d2g7rtth')
    let result = await createRandom(db, 100)
    console.dir(result)
  } catch (err) {
    console.dir(err)
  }
}



