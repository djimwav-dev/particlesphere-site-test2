import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {artistType} from './artistType'
import {workType} from './workType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Content types
    artistType,
    workType,
    postType,
    
    // Supporting types
    authorType,
    categoryType,
    blockContentType,
  ],
}
