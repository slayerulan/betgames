const {
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql')

const users = require('./data/users')
const games = require('./data/games')
const bets = require('./data/bets')
const draws = require('./data/draws')

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      auth: users.Query.auth,
      user: users.Query.user,
      games: games.Query.games,

      latestDraw: draws.Query.latestDraw
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
