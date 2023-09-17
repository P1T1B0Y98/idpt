const QuestionnaireResponseRepository = require(
    '../database/repositories/questionnaireResponseRepository'
  )
  const ValidationError = require('../errors/validationError')
  const MongooseRepository = require(
    '../database/repositories/mongooseRepository'
  )
  const { ObjectId } = require('mongodb');
  const { encrypt } = require('../security/cryptoHelper')
  
  /**
   * Handles Questionnaire operations
   */
  module.exports = class QuestionnaireResponseService {
    constructor ({ currentUser, language }) {
      this.repository = new QuestionnaireResponseRepository()
      this.currentUser = currentUser
      this.language = language
    }
  
    /**
     * Creates a Questionnaire.
     *
     * @param {*} data
     */
    async create (data) {
      const session = await MongooseRepository.createSession()
  
      try {
        const record = await this.repository.create(data, {
          session: session,
          currentUser: this.currentUser
        })
  
        await MongooseRepository.commitTransaction(session)
  
        return record
      } catch (error) {
        await MongooseRepository.abortTransaction(session)
        throw error
      }
    }
  
    /**
     * Updates a Questionnaire.
     *
     * @param {*} id
     * @param {*} data
     */
    async update (id, data) {
      const session = await MongooseRepository.createSession()
  
      try {
        const record = await this.repository.update(id, data, {
          session,
          currentUser: this.currentUser
        })
  
        await MongooseRepository.commitTransaction(session)
  
        return record
      } catch (error) {
        await MongooseRepository.abortTransaction(session)
        throw error
      }
    }
  
    /**
     * Destroy all Questionnaires with those ids.
     *
     * @param {*} ids
     */
    async destroyAll (ids) {
      const session = await MongooseRepository.createSession()
  
      try {
        for (const id of ids) {
          await this.repository.destroy(id, {
            session,
            currentUser: this.currentUser
          })
        }
  
        await MongooseRepository.commitTransaction(session)
      } catch (error) {
        await MongooseRepository.abortTransaction(session)
        throw error
      }
    }
  
    /**
     * Finds the Questionnaire by Id.
     *
     * @param {*} id
     */
    async findById (id) {
      return this.repository.findById(id)
    }
  
    /**
     * Finds Questionnaires for Autocomplete.
     *
     * @param {*} search
     * @param {*} limit
     */
    async findAllAutocomplete (search, limit) {
      return this.repository.findAllAutocomplete(search, limit)
    }
  
    /**
     * Finds Questionnaires based on the query.
     *
     * @param {*} args
     */
    async findAndCountAll (args) {
      return this.repository.findAndCountAll(args)
    }
  
    /**
     * Imports a list of Questionnaires.
     *
     * @param {*} data
     * @param {*} importHash
     */
    async import (data, importHash) {
      if (!importHash) {
        throw new ValidationError(
          this.language,
          'importer.errors.importHashRequired'
        )
      }
  
      if (await this._isImportHashExistent(importHash)) {
        throw new ValidationError(
          this.language,
          'importer.errors.importHashExistent'
        )
      }
  
      const dataToCreate = { ...data, importHash }
  
      return this.create(dataToCreate)
    }
  
        /**
     * Finds Questionnaire Responses by User ID.
     *
     * @param {string} userId - The ID of the user for whom to find Questionnaire responses.
     * @param {object} options - Additional options for the query.
     * @returns {Promise<Array>} - An array of Questionnaire responses for the specified user.
     */
        async findByUserId(userId, options = {}) {
          const questionnaireResponses = await this.repository.findAndCountAll({
            filter: { userId: userId },
            ...options
          });
          
          const updatedRows = questionnaireResponses.rows.map(response => {
            const copiedResponse = { ...response.toObject() }; // Create a deep copy
            const encryptedFormData = encrypt(JSON.stringify(response.item));
            copiedResponse.item = encryptedFormData;
            return copiedResponse;
          });
          questionnaireResponses.rows = updatedRows;

          return questionnaireResponses;
        }
        
        

    /**
     * Checks if the import hash already exists.
     * Every item imported has a unique hash.
     *
     * @param {*} importHash
     */
    async _isImportHashExistent (importHash) {
      const count = await this.repository.count({ importHash })
  
      return count > 0
    }
  }
  