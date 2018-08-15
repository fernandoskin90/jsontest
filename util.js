const json = require('./Desarrollo/json con resultado de analisis/1053780671-CertificadoCamaraComercio.txt.json');

const RELATIONS = {
    types: {
        idWidthTypeId: 'documento_identidad_tiene_tipo_documento_identidad',
        personWithId: 'persona_tiene_documento_identidad',
        personWithTypeId: 'persona_tiene_tipo_documento_identidad'
    }
};

const ENTITIES = {
    subTypes: {
        naturalPerson: 'SUBTIPO_PERSONA_NATURAL'
    },
    types: {
        id: 'DOCUMENTO_IDENTIDAD'
    }
};

const getIdFromNaturalPerson = (data) => {};

const getIdFromNaturalPersonWithTypeId = (data) => {};

const getIdFromIdWithTypeId = (data) => {
    const findDesambiguationSubtype = (item, subType) => item.find(des => des === subType);
    const findEntitiesWithSubtype = (items, subType) => items.filter(des => des === subType);

    if (!data.relations) {
        return null;
    }
    const relationsWithId =
        data.relations.filter(item => item.type === RELATIONS.types.idWidthTypeId);

    const entitiesWithId =
        relationsWithId.filter(
            (relation) => {
                relation.arguments.filter(
                    (argument) => {
                        argument.entities.filter(
                            (entity) => {
                                entity.disambiguation.subtype.find(subt => subt === ENTITIES.subTypes.naturalPerson);
                            }
                        );
                    }
                );
            }
        );

    console.log(entitiesWithId);
    
   
};

getIdFromIdWithTypeId(json);
