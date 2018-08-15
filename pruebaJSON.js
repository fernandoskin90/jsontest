// const json = require('../../fernando/Descargas/test-files-output/9006123077-CertificadoCamaraComercio.txt.json')
// const json = require('../../fernando/Descargas/Desarrollo/json con resultado de analisis/1076658130-CertificadoCamaraComercio.txt.json')
// const json = require('../../fernando/Descargas/test-files-output/8301171811-CertificadoCamaraComercio.txt.json')
// const json = require('../../fernando/Descargas/Desarrollo/json con resultado de analisis/1053780671-CertificadoCamaraComercio.txt.json')
// const json = require('../../fernando/Descargas/Desarrollo/json con resultado de analisis/1060268413-CertificadoCamaraComercio.txt.json')
// const json = require('./Desarrollo/json con resultado de analisis/1062290703-CertificadoCamaraComercio.txt.json')
// const json = require('./test-files-output/8300343636-CertificadoCamaraComercio.txt.json')
const json = require('./test-files-output/8300860231-CertificadoCamaraComercio.txt.json')

/**
 * Constantes de relaciones y entidades para las busquedas
 */
const types = {
    ACTIVITY: 'ACTIVIDAD',
    PERSON: 'PERSONA',
    COMPANY: 'EMPRESA',
    DATE: 'FECHA',
    DOCUMENT: 'DOCUMENTO_IDENTIDAD',
    TYPE_COMPANY: 'TIPO_ORGANIZACION',
    REGISTER_COMPANY: 'ESTADO_MATRICULA',
    subTypes: {
        alternatePerson: 'SUBTIPO_PERSONA_SUPLENTE',
        typePerson: 'SUBTIPO_PERSONA_NATURAL',
        subDate: 'SUBTIPO_FECHA_MATRICULA',
        legalPerson: 'SUBTIPO_PERSONA_REPRESENTANTE_LEGAL'
    }
}

const relations = {
  documentPerson: 'persona_tiene_documento_identidad',
  documentCompany: 'empresa_tiene_documento_identidad',
  mainActivity: 'es_actividad_principal',
  secundaryActivity: 'es_actividad_secundaria',
  otherActivity: 'es_actividad_otra'
}

/**
 * funciones de filtrado para devolver los datos necesarios
 * @param {json} data contiene toda la iformación a filtrar
 * @returns {string} texto con la información deseada
 */

const getIdCompany = (data) => {
  let companyId
  const dato = data.relations
  const company = dato.filter(item => item.type === relations.documentCompany)[0]
  if (!company) {
    return companyId = ''
  }
  const textId = company.arguments.filter(item => item.entities.filter(x => x.type === types.DOCUMENT))[1].text
  if (!textId) {
    return companyId = ''
  }
  return companyId = textId
}

const getComapanyName = (data) => {
  let company
  const entities = data.entities
  const item = entities.filter(entitie => entitie.type === types.COMPANY)
  if (!item.length) {
    return company = ''
  }
  return company = item[0].text
}

const getTypeCompany = (data) => {
  let typeCompany
  const entitie = data.entities
  const company = entitie.filter(item => item.type === types.TYPE_COMPANY)
  if (!company.length) {
    return typeCompany = ''
  }
  return typeCompany =  company[0].text
}

const registerCompany = (data) => {
  let register
  const entities = data.entities
  const registerCompany = entities.filter(item => item.type === types.REGISTER_COMPANY)

  if (!registerCompany.length) {
    return register = ''
  }

  return register = registerCompany[0].text
}

const getDateRegister = (data) => {
  let dateRefister
  const entities = data.entities

  const infoJson = entities.filter(item => item.type === types.DATE && item.disambiguation.subtype[0] === types.subTypes.subDate)[0].text
  if (!infoJson) {
    return dateRefister = ''
  }
  return dateRefister = infoJson
}

// falta por terminar
const getNameLegalPerson = (data) => {
  let nameLegalPerson

  const entities = data.entities

  const x = entities.filter(item => item.type === types.PERSON)

  const y = x.filter(data => data.disambiguation.subtype.filter(x => x === types.subTypes.legalPerson))

  // if (!infoEntities.length) {
  //   return nameLegalPerson = ''
  // }

  // const infoLegalPerson = infoEntities.filter(item => item.disambiguation)

  // if(!infoLegalPerson.length) return null

  return y
}

const getIdPerson = (data) => {

  let idPerson
  const idPersons = []

  const relation = data.relations

  const infoRelation = relation.filter(item => item.type === relations.documentPerson)

  for (let index in infoRelation) {

    // console.log('relation', infoRelation[index])

    const relation = infoRelation[index]

    if (relation.arguments[0].entities[0].disambiguation.subtype[0] === types.subTypes.typePerson) {
      idPerson = relation.arguments[1].text
      idPersons.push(idPerson)
    }
  }

  const resultado  = idPersons.filter( onlyUnique );

  return resultado

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


// GET ACTIVITY CODES
const getRelationsActivity = (data, typeActivity) =>
    data.relations
        .filter(item => item.type === typeActivity)
        .map(rel => rel.arguments[0].text);

const getEntitiesActivity = (data) =>
    data.entities
        .filter(ent => ent.type === types.ACTIVITY)
        .map(ent => ent.text);

const selectAcitities = (data) => {
    const keysArray = [
        relations.mainActivity,
        relations.secundaryActivity,
        relations.otherActivity,
        types.ACTIVITY
    ];

    let activities = [];
    let activityType;
    for (let index = 0; index < keysArray.length; index++) {
        if (activities.length) {
            break;
        }
        if (index in [0, 1, 2]) {
            activities = getRelationsActivity(data, keysArray[index]);
        } else {
            activities = getEntitiesActivity(data);
        }
        activityType = keysArray[index];
    }

    return {
        activities,
        activityType
    };
};

const filterCodesFromActivities = (data) => {
    const regCode = /[a-z]\d+/gi;
    const selectedData = selectAcitities(json);
    const codes = selectedData.activities
        .map(act => act.match(regCode))
        .toString()
        .split(',')
        .filter(onlyUnique);
    return {
        codes,
        type: selectedData.activityType
    };
};

const getAlternatePeople = (data) =>
    data.entities
        .filter(ent => ent.type === types.PERSON)
        .filter(ent => ent.disambiguation.subtype.indexOf(types.subTypes.alternatePerson) >= 0)
        .map(person => person.text);

const getAlternateId = (data) =>
    data.entities
        .filter(ent => ent.type === types.DOCUMENT)
        .filter(ent => ent.disambiguation.subtype.indexOf(types.subTypes.alternatePerson) >= 0)
        .map(person => person.text);

console.log(getAlternateId(json));
