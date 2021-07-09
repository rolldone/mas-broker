import BaseProto from "./BaseProto";
import staticType from "./StaticType";
import { Model } from "sequelize";

export interface BaseModelInterface extends BaseProtoInterface<BaseModelInterface> {
  model: any | null
  _includes?: Array<any>
  _excludes?: Array<any>
  _raw?: boolean
  _nest?: boolean
  setIncludes ?: {(props:Array<any>):void}
  getRaw?: { (): boolean }
  getNest?: { (): boolean }
  getIncludes?: { (includes?: Array<any>): void }
  getExcludes?: { (excludes?: Array<any>): void }
  save?: (...props : any)=> Promise<any>
  update?: (props: any)=> Promise<any>
  delete?:(props: any)=> Promise<any>
  first?: (props: any)=> Promise<any>
  get?: (props: any)=> Promise<any>
  raw?: boolean | null
  nest?: boolean | null
  _removeSameString?: { (fullPath: string, basePath: string): string }
}

const BaseModel = BaseProto.extend<BaseModelInterface>({
  model: null,
  _includes: [],
  _excludes: [],
  _raw: false,
  _nest: true,
  raw: null,
  nest: null,
  setIncludes : function(props){
    this._includes = props;
  },
  getRaw: function () {
    return this.raw || this._raw;
  },
  getNest: function () {
    return this.nest || this._nest;
  },
  getIncludes: function (includes = []) {
    includes = [
      ...this._includes,
      ...includes || []
    ]
    console.log('includes', includes);
    return includes;
  },
  getExcludes: function (excludes = []) {
    excludes = [
      ...this._excludes,
      ...excludes || []
    ];
    console.log('excludes', excludes);
    return excludes;
  },
  save: async function (props, currentModel = null) {
    let self = this;
    try {
      let resData = null;
      if (currentModel != null) {
        resData = await currentModel.update(props);
      } else {
        resData = await self.model.create(props);
      }
      resData = await self.first({
        where: {
          id: resData.id
        },
      })
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  update: async function (props) {
    let self = this;
    try {
      let resData = await self.model.findOne({
        where: {
          id: props.id
        }
      })
      resData = await self.save(props, resData);
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  delete: async function (props) {
    staticType(props, [Object]);
    let self = this;
    try {
      return await self.model.destroy(props);
    } catch (ex) {
      throw ex;
    }
  },
  first: async function (props) {
    let self = this;
    try {
      console.log('self.', self.model);
      let resData = await self.model.findOne({
        ...props,
        attributes: { exclude: self.getExcludes(), include: self.getIncludes() },
        raw: self.getRaw(),
        nest: self.getNest()
      });;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  get: async function (props) {
    let self = this;
    try {
      let resData = await self.model.findAll({
        ...props,
        attributes: { exclude: self.getExcludes(), include: self.getIncludes() },
        raw: self.getRaw(),
        nest: self.getNest()
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  _removeSameString: function (fullPath, basePath) {
    return fullPath.replace(basePath, '');
  }
});

export default BaseModel;