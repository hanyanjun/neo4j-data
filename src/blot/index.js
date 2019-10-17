
import { v1 as neo4j } from 'neo4j-driver'
import { stringFormat } from './cypherTypesFormatting'

const extractPathForRows = (path, converters) => {
    let segments = path.segments
    // Zero length path. No relationship, end === start
    if (!Array.isArray(path.segments) || path.segments.length < 1) {
      segments = [{...path, end: null }]
    }
    return segments.map(function (segment) {
      return [
        objIntToString(segment.start, converters),
        objIntToString(segment.relationship, converters),
        objIntToString(segment.end, converters)
      ].filter(part => part !== null)
    })
  }
function extractFromNeoObjects (obj, converters) {
    if (
      obj instanceof neo4j.types.Node ||
      obj instanceof neo4j.types.Relationship
    ) {
      return obj.properties
    } else if (obj instanceof neo4j.types.Path) {
      return [].concat.apply([], extractPathForRows(obj, converters))
    }
    return obj
  }
const flattenArray = arr => {
    return arr.reduce((all, curr) => {
      if (Array.isArray(curr)) return all.concat(flattenArray(curr))
      return all.concat(curr)
    }, [])
  }
function arrayIntToString (arr, converters) {
    return arr.map(item => itemIntToString(item, converters))
  }
  function objIntToString (obj, converters) {
    let entry = converters.objectConverter(obj, converters)
    let newObj = null
    if (Array.isArray(entry)) {
      newObj = entry.map(item => itemIntToString(item, converters))
    } else if (entry !== null && typeof entry === 'object') {
      newObj = {}
      Object.keys(entry).forEach(key => {
        newObj[key] = itemIntToString(entry[key], converters)
      })
    }
    return newObj
  }
const recursivelyExtractGraphItems = (types, item) => {
    if (item instanceof types.Node) return item
    if (item instanceof types.Relationship) return item
    if (item instanceof types.Path) return item
    if (Array.isArray(item)) {
      return item.map(i => recursivelyExtractGraphItems(types, i))
    }
    if (['number', 'string', 'boolean'].indexOf(typeof item) !== -1) return false
    if (item === null) return false
    if (typeof item === 'object') {
      return Object.keys(item).map(key =>
        recursivelyExtractGraphItems(types, item[key])
      )
    }
    return item
  }
  function itemIntToString (item, converters) {
    const res = stringFormat(item)
    if (res) return res
    if (converters.intChecker(item)) return converters.intConverter(item)
    if (Array.isArray(item)) return arrayIntToString(item, converters)
    if (['number', 'string', 'boolean'].indexOf(typeof item) !== -1) return item
    if (item === null) return item
    if (typeof item === 'object') return objIntToString(item, converters)
  }

 const  extractNodesAndRelationshipsFromPath = (item, rawNodes, rawRels) => {
    let paths = Array.isArray(item) ? item : [item]
    paths.forEach(path => {
      let segments = path.segments
      // Zero length path. No relationship, end === start
      if (!Array.isArray(path.segments) || path.segments.length < 1) {
        segments = [{ ...path, end: null }]
      }
      segments.forEach(segment => {
        if (segment.start) rawNodes.push(segment.start)
        if (segment.end) rawNodes.push(segment.end)
        if (segment.relationship) rawRels.push(segment.relationship)
      })
    })
  }


  export const dataDetail = (records) =>{
      
  if (records.length === 0) {
    return { nodes: [], relationships: [] , nodesMap : {} , relationshipsMap : {}}
}
let types = neo4j.types;
let keys = records[0].keys
let rawNodes = []
let rawRels = []

    const intChecker = neo4j.isInt
    const intConverter = val => val.toString()
    const converters = {
        intChecker,
        intConverter,
        objectConverter :extractFromNeoObjects
    }
records.forEach(record => {
    let graphItems = keys.map(key => record.get(key))
    graphItems = flattenArray(
    recursivelyExtractGraphItems(types, graphItems)
    ).filter(item => item !== false)
    rawNodes = [
    ...rawNodes,
    ...graphItems.filter(item => item instanceof types.Node)
    ]
    rawRels = [
    ...rawRels,
    ...graphItems.filter(item => item instanceof types.Relationship)
    ]
    let paths = graphItems.filter(item => item instanceof types.Path)
    paths.forEach(item =>
    extractNodesAndRelationshipsFromPath(item, rawNodes, rawRels, types)
    )
})
let nodesMap  = {};
let relationshipsMap = {};
const nodes = rawNodes.map(item => {
  let info = {
  id: item.identity.toString(),
  labels: item.labels,
  properties: itemIntToString(item.properties, converters)
  }

  nodesMap[item.identity.toString()] = info;
  return info;
})
let relationships = rawRels
// if (filterRels) {
    relationships = rawRels.filter(
    item =>
        nodes.filter(node => node.id === item.start.toString()).length > 0 &&
        nodes.filter(node => node.id === item.end.toString()).length > 0
    )
// }
relationships = relationships.map(item => {
    let info = {
    id: item.identity.toString(),
    startNodeId: item.start.toString(),
    endNodeId: item.end.toString(),
    type: item.type,
    properties: itemIntToString(item.properties, converters)
    }
    relationshipsMap[item.identity.toString()] = info
    return info;
})
return {
    nodes,
    relationships,
    nodesMap,
    relationshipsMap
}
  }