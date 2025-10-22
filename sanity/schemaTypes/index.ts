import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {artistType} from './artistType'
import {artistSubmissionType} from './artistSubmissionType'
import {workType} from './workType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Content types
    artistType,
    artistSubmissionType,
    workType,
    postType,
    
    // Supporting types
    authorType,
    categoryType,
    blockContentType,
  ],
}
