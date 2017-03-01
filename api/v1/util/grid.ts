/**
 * 用來表示多個方格
 * 
 * @export
 * @class Grids
 */
export class Grids {
  /**
   * 用多個連續方格建立出不連續的方格區域
   * 
   * @param {ConsecutiveGrids[]} consecutiveGrids 連續方格
   * 
   * @memberOf Grids
   */
  constructor(public consecutiveGrids: ConsecutiveGrids[]) {
  }


  /**
   * 該不連續方格的組成方格
   * 
   * @readonly
   * @type {Grid[]}
   * @memberOf Grids
   */
  get grids(): Grid[] {
    return this.consecutiveGrids.reduce((accu, curr) => [...accu, ...curr.grids], <Grid[]>[])
  }

  /**
   * 從方格描述字串回傳
   * 
   * ## 格式
   * 1. *不連續方格描述* ⟵ *連續方格*[,*不連續方格描述*]
   * 2. *連續方格* ⟵ *起始緯度*-*終止緯度*:*起始經度*-*終止經度*；其中終止緯度必須大於起始緯度；終止經度必須大於起始經度
   * 3. *起始緯度*, *終止緯度* ⟵ *緯度*
   * 4. *緯度* ⟵ [+|-]*緯度值*；其中 +（可忽略）表示北緯； -（步可忽略）表示南緯，緯度值必須為 0.01 的倍數，且緯度值必須小於等於 90
   * 5. *起始經度*, *終止經度* ⟵ *經度*
   * 6. *經度* ⟵ [+|-]*經度值*；其中 +（可忽略）表示東經； -（步可忽略）表示西經，經度值必須為 0.01 的倍數，且經度值必須小於等於 180
   * 
   * @static
   * @param {string} representation 不連續方格描述
   * @returns {Grids}
   * 
   * @memberOf Grids
   */
  static parse(representation: string): Grids {
    let consecutives = representation.split(',').map(subRepresentation => ConsecutiveGrids.parse(subRepresentation))
    return new Grids(consecutives)
  }
}

/**
 * 用來表示多個連續的方格
 * 
 * @export
 * @class ConsecutiveGrids
 * @extends { NonconsecutiveGrids }
 */
export class ConsecutiveGrids extends Grids {
  /**
   * 用起始經緯度以及長寬方格數來建立方格
   * 
   * @param {number} longitude 經度
   * @param {number} latitude  緯度
   * @param {number} longitudeGridSpan 經度跨越方格數
   * @param {number} latitudeGridSpan  緯度跨越方格數
   * 
   * @memberOf ConsecutiveGrids
   */
  constructor(public longitude: number,
    public latitude: number,
    public longitudeGridSpan: number,
    public latitudeGridSpan: number) {
    super([])
    this.consecutiveGrids.push(this)
  }

  /**
   * 該連續方格的組成方格
   * 
   * @readonly
   * @type {Block[]}
   * @memberOf ConsecutiveBlocks
   */
  get grids(): Grid[] {
    let result: Grid[] = []
    for (let longitudeBlock = 0; longitudeBlock <= this.longitudeGridSpan; ++longitudeBlock) {
      for (let latitudeBlock = 0; latitudeBlock <= this.latitudeGridSpan; ++latitudeBlock) {
        result.push(new Grid(this.longitude + longitudeBlock * 0.01, this.latitude + latitudeBlock * 0.01))
      }
    }
    return result
  }

  /**
   * 從方格描述字串回傳
   * 
   * ## 格式
   * 2. *連續方格描述* ⟵ *起始緯度*-*終止緯度*:*起始經度*-*終止經度*；其中終止緯度必須大於起始緯度；終止經度必須大於起始經度
   * 3. *起始緯度*, *終止緯度* ⟵ *緯度*
   * 4. *緯度* ⟵ [+|-]*緯度值*；其中 +（可忽略）表示北緯； -（步可忽略）表示南緯，緯度值必須為 0.01 的倍數，且緯度值必須小於等於 90
   * 5. *起始經度*, *終止經度* ⟵ *經度*
   * 6. *經度* ⟵ [+|-]*經度值*；其中 +（可忽略）表示東經； -（步可忽略）表示西經，經度值必須為 0.01 的倍數，且經度值必須小於等於 180
   * 
   * @static
   * @param {string} representation 連續方格描述
   * @returns {ConsecutiveGrids}
   * 
   * @memberOf ConsecutiveGrids
   */
  static parse(representation: string): ConsecutiveGrids {
    let [[latStart, latEnd], [lngStart, lngEnd]] = representation.split(':').map(range => range.split('-').map(str => Number.parseFloat(str)))
    let latSpan = latEnd * 100 - latStart * 100
    let lngSpan = lngEnd * 100 - lngStart * 100

    return new ConsecutiveGrids(lngStart, latStart, lngSpan, latSpan);
  }
}

/**
 * 用來表示單一方格
 * 
 * @export
 * @class Grid
 * @extends { ConsecutiveGrids }
 */
export class Grid extends ConsecutiveGrids {
  /**
   * 用經度緯度建立方格
   * 
   * @param {number} longitude 經度
   * @param {number} latitude  緯度
   * 
   * @memberOf Grid
   */
  constructor(public longitude: number, public latitude: number) {
    super(longitude, latitude, 1, 1)
  }
}
