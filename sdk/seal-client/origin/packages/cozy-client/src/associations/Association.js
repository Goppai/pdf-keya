/**
 * Associations are used by components to access related store documents that are
 * linked in a document. They are also responsible for building the `QueryDefinition` that is
 * used by the client to automatically fetch relationship data.
 *
 * Hydrated documents used by components come with Association instances.
 *
 * @description
 * Example: The schema defines an `author` relationship :
 *
 * ```js
 * const BOOK_SCHEMA = {
 *   relationships: {
 *      author: 'has-one'
 *   }
 * }
 * ```
 *
 * Hydrated `books` will have the `author` association instance under the `author` key.
 * Accessing `hydratedBook.author.data` gives you the author from the store, for example :
 *
 * ```json
 * {
 *   "name": "St-Exupery",
 *   "firstName": "Antoine",
 *   "_id": "antoine"
 * }
 * ```
 *
 * It is the responsibility of the relationship to decide how the relationship data is stored.
 * For example, here since we use the default `has-one` relationship, the relationship data
 * is stored in the `relationships` attribute of the original document (in our case here, our book
 * would be
 *
 * ```json
 * {
 *   "title": "Le petit prince",
 *   "relationships": {
 *     "author": {
 *       "data": {
 *         "doctype": "io.cozy.authors",
 *         "_id": "antoine"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * In the case of an "in-place" relationship, the relationship data is stored directly under the attribute named
 * by the relationship (in our case `author`). Our book would be
 *
 * ```json
 * {
 *     "title": "Le petit prince",
 *     "author": "antoine"
 * }
 * ```
 *
 * ---
 *
 * Each different type of Association may change:
 *
 * - `get raw`: how the relationship data is stored (either as per the JSON API spec or
 *  in a custom way)
 * - `get data`: how the store documents are then fetched from the store to be added to
 * the hydrated document (.data method). View components will access
 * `hydratedDoc[relationshipName].data`.
 * - `get query`: how to build the query to fetch related documents
 *
 */
class Association {
  /**
   * @param  {object} target - Original object containing raw data
   * @param  {string} name - Attribute under which the association is stored
   * @param  {string} doctype - Doctype of the documents managed by the association
   * @param  {function} options.dispatch - Store's dispatch, comes from the client
   * @param {string} options
   */
  constructor(target, name, doctype, options) {
    const { dispatch, get, query, mutate, save } = options
    /**
     * The original document declaring the relationship
     * @type {object}
     */
    this.target = target
    /**
     * The name of the relationship.
     * @type {string}
     * @example 'author'
     */
    this.name = name

    /**
     * Doctype of the relationship
     * @type {string}
     * @example 'io.cozy.authors'
     */
    this.doctype = doctype

    /**
     * Returns the document from the store
     * @type {function}
     */
    this.get = get

    /**
     * Performs a query to retrieve relationship documents.
     * @param {QueryDefinition} queryDefinition
     * @method
     */
    this.query = query

    /**
     * Performs a mutation on the relationship.
     * @method
     */
    this.mutate = mutate

    /**
     * Saves the relationship in store.
     * @type {function}
     */
    this.save = save
    /**
     * Dispatch an action on the store.
     * @type {function}
     */
    this.dispatch = dispatch
  }

  /**
   *
   * Returns the raw relationship data as stored in the original document
   *
   * For a document with relationships stored as JSON API spec:
   *
   * ```js
   * const book = {
   *   title: 'Moby Dick',
   *   relationships: {
   *     author: {
   *       data: {
   *         doctype: 'io.cozy.authors',
   *         id: 'herman'
   *       }
   *     }
   *   }
   *  }
   * ```
   *
   * Raw value will be
   *
   * ```json
   * {
   *   "doctype": "io.cozy.authors",
   *   "id": "herman"
   * }
   * ```
   *
   * Derived `Association`s need to implement this method.
   */
  get raw() {
    throw new Error('A relationship must define its raw getter')
  }

  /**
   * Returns the document(s) from the store
   *
   * For document with relationships stored as JSON API spec :
   *
   * ```js
   * const book = {
   *   title: 'Moby Dick',
   *   relationships: {
   *     author: {
   *       data: {
   *         doctype: 'io.cozy.authors',
   *         id: 'herman'
   *       }
   *     }
   *   }
   *  }
   * ```
   *
   * `data` will be
   *
   * ```json
   * {
   *   "_id": "herman"
   *   "_type": "io.cozy.authors",
   *   "firstName": "herman",
   *   "name": "Melville"
   * }
   * ```
   *
   * Derived `Association`s need to implement this method.
   */
  get data() {
    throw new Error('A relationship must define its data getter')
  }

  /**
   * Derived `Association`s need to implement this method.
   * @return {QueryDefinition}
   */
  static query() {
    throw new Error('A custom relationship must define its query() function')
  }
}

export default Association
