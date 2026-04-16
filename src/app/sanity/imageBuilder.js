import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

// This creates the translator engine using your specific database details
const builder = imageUrlBuilder(client)

// This is the function we will call to translate the coordinates
export function urlFor(source) {
  return builder.image(source)
}