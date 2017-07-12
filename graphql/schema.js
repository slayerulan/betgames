const {
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql')

const users = require('./data/users')
const games = require('./data/games')
const bets = require('./data/bets')

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      auth: users.Query.auth,
      user: users.Query.user,
      games: games.Query.games
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      login: users.Mutation.login,
      createBet: bets.Mutation.createBet
    }
  })

})
