import { StructureBuilder } from 'sanity/desk'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Artist Submissions')
        .child(
          S.documentTypeList('artistSubmission')
            .title('Messages reçus')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),
      S.divider(),
      // ...existing code...
    ])

export default deskStructure