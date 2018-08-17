// const json = require('./test-files-output/9006123077-CertificadoCamaraComercio.txt.json')
// const json = require('./Desarrollo/json con resultado de analisis/1076658130-CertificadoCamaraComercio.txt.json')
// const json = require('./test-files-output/8301171811-CertificadoCamaraComercio.txt.json')
// const json = require("./Desarrollo/json con resultado de analisis/1053780671-CertificadoCamaraComercio.txt.json");
const json = require("./Desarrollo/json con resultado de analisis/1055916390-CertificadoCamaraComercio.txt.json");
// const json = require('./Desarrollo/json con resultado de analisis/1060268413-CertificadoCamaraComercio.txt.json')
// const json = require('./Desarrollo/json con resultado de analisis/1062290703-CertificadoCamaraComercio.txt.json')
// const json = require('./test-files-output/8300343636-CertificadoCamaraComercio.txt.json')
// const json = require('./test-files-output/8300860231-CertificadoCamaraComercio.txt.json')
// const json = require("./Desarrollo/json con resultado de analisis/1076658130-CertificadoCamaraComercio.txt.json");
// const json = require("./test-files-output/8301171811-CertificadoCamaraComercio.txt.json");

/**
 * Constantes de relaciones y entidades para las busquedas
 */
const types = {
  ACTIVITY: "ACTIVIDAD",
  PERSON: "PERSONA",
  COMPANY: "EMPRESA",
  DATE: "FECHA",
  DOCUMENT: "DOCUMENTO_IDENTIDAD",
  TYPE_COMPANY: "TIPO_ORGANIZACION",
  REGISTER_COMPANY: "ESTADO_MATRICULA",
  subTypes: {
    alternatePerson: "SUBTIPO_PERSONA_SUPLENTE",
    typePerson: "SUBTIPO_PERSONA_NATURAL",
    subDate: "SUBTIPO_FECHA_MATRICULA",
    legalPerson: "SUBTIPO_PERSONA_REPRESENTANTE_LEGAL",
    effectiveDate: "SUBTIPO_FECHA_VIGENCIA"
  }
};

// Contiene las constantes con los tipos de relaciones
const relations = {
  documentPerson: "persona_tiene_documento_identidad",
  documentCompany: "empresa_tiene_documento_identidad",
  mainActivity: "es_actividad_principal",
  secundaryActivity: "es_actividad_secundaria",
  otherActivity: "es_actividad_otra"
};

/**
 * funciones de filtrado para devolver los datos necesarios
 * @param {json} data contiene toda la iformación a filtrar
 * @returns {string} texto con la información deseada
 */

// Obtiene el documento de la empresa consultada
const getIdCompany = data => {
  let companyId;
  const dato = data.relations;
  const company = dato.filter(
    item => item.type === relations.documentCompany
  )[0];
  if (!company) {
    return (companyId = "");
  }
  const textId = company.arguments.filter(item =>
    item.entities.filter(x => x.type === types.DOCUMENT)
  )[1].text;
  if (!textId) {
    return (companyId = "");
  }
  return (companyId = textId);
};

// Obtiene el nombre de la compañia consultada
const getComapanyName = data => {
  let company;
  const entities = data.entities;
  const item = entities.filter(entitie => entitie.type === types.COMPANY);
  if (!item.length) {
    return (company = "");
  }
  return (company = item[0].text);
};

// Obtiene el tipo de compañia consultada en el archivo
const getTypeCompany = data => {
  let typeCompany;
  const entitie = data.entities;
  const company = entitie.filter(item => item.type === types.TYPE_COMPANY);
  if (!company.length) {
    return (typeCompany = "");
  }
  return (typeCompany = company[0].text);
};

// Obtiene el estado de la matrícula de la compañía consultada
const registerCompany = data => {
  let register;
  const entities = data.entities;
  const registerCompany = entities.filter(
    item => item.type === types.REGISTER_COMPANY
  );

  if (!registerCompany.length) {
    return (register = "");
  }

  return (register = registerCompany[0].text);
};

// Obitiene la fecha de matrícula de la empresa consultada
const getDateRegister = data => {
  let dateRefister;
  const entities = data.entities;

  const infoJson = entities.filter(
    item =>
      item.type === types.DATE &&
      item.disambiguation.subtype[0] === types.subTypes.subDate
  )[0].text;
  if (!infoJson) {
    return (dateRefister = "");
  }
  return (dateRefister = infoJson);
};

// Obtiene el nombre del representante legal
const getNameLegalPerson = data => {
  let nameLegalPerson;

  return data.entities
    .filter(item => item.type === types.PERSON)
    .filter(
      ent => ent.disambiguation.subtype[0] === types.subTypes.alternatePerson
    )[0].text;
};

// Obtiene el documento de identidad del representante legal
const getIdPerson = data => {
  let idPerson;
  const idPersons = [];

  const relation = data.relations;

  const infoRelation = relation.filter(
    item => item.type === relations.documentPerson
  );

  for (let index in infoRelation) {
    // console.log('relation', infoRelation[index])

    const relation = infoRelation[index];

    if (
      relation.arguments[0].entities[0].disambiguation.subtype[0] ===
      types.subTypes.typePerson
    ) {
      idPerson = relation.arguments[1].text;
      idPersons.push(idPerson);
    }
  }

  const resultado = idPersons.filter(onlyUnique);

  return resultado;
};

// Obtiene la fecha de vigencia de la matricula
const getEffectiveDate = data =>
  data.entities
    .filter(item => item.type === types.DATE)
    .filter(
      sub => sub.disambiguation.subtype[0] === types.subTypes.effectiveDate
    )[0].text;

// Eliminca los registros repetidos dentro de un array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

// GET ACTIVITY CODES
const getRelationsActivity = (data, typeActivity) =>
  data.relations
    .filter(item => item.type === typeActivity)
    .map(rel => rel.arguments[0].text);

const getEntitiesActivity = data =>
  data.entities.filter(ent => ent.type === types.ACTIVITY).map(ent => ent.text);

const selectAcitities = data => {
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

const filterCodesFromActivities = data => {
  const regCode = /[a-z]\d+/gi;
  const selectedData = selectAcitities(json);
  const codes = selectedData.activities
    .map(act => act.match(regCode))
    .toString()
    .split(",")
    .filter(onlyUnique);
  return codes;
};

// obtiene la actividad secundaria
const getSecundaruActivity = data => {
  let secundaryActivities = [];
  const regCode = /[a-z]?\d+/gi;
  const infoJson = data.relations
    .filter(item => item.type === relations.secundaryActivity)
    .map(rel => rel.arguments[0])
    .map(text => text.text.match(regCode))
    .toString()
    .split(",")
    .filter(onlyUnique);

  if (!infoJson) return secundaryActivities;
  return infoJson;
};

// obtiene otra actividad
const geOtherActivity = data => {
  let secundaryActivities = [];
  const regCode = /[a-z]?\d+/gi;
  const infoJson = data.relations
    .filter(item => item.type === relations.otherActivity)
    .map(rel => rel.arguments[0])
    .map(text => text.text.match(regCode))
    .toString()
    .split(",")
    .filter(onlyUnique);

  if (!infoJson) return secundaryActivities;
  return infoJson;
};

// Obtiene el nombre de la persona suplente
const getAlternatePeople = data =>
  data.entities
    .filter(ent => ent.type === types.PERSON)
    .filter(
      ent =>
        ent.disambiguation.subtype.indexOf(types.subTypes.alternatePerson) >= 0
    )
    .map(person => person.text);

// Obtiene el documento de identidad de la persona suplente
const getAlternateId = data =>
  data.entities
    .filter(ent => ent.type === types.DOCUMENT)
    .filter(
      ent =>
        ent.disambiguation.subtype.indexOf(types.subTypes.alternatePerson) >= 0
    )
    .map(person => person.text);

console.log(geOtherActivity(json));
