import uuidv4 from 'uuid/v4';

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }) {
    const output = [];
    for (let i = 0; i < numRolls; i += 1) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

const fakeDatabase = {};

const root = {
  hello: () => 'Hello world!',
  quoteOfTheDay: () => (Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within'),
  random: () => Math.random(),
  rollThreeDice: () => [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6)),
  rollDice: ({ numDice, numSides }) => {
    const a = numDice + numSides;
    return [7, a];
  },
  getDie({ numSides }) {
    return new RandomDie(numSides || 6);
  },
  getMessage({ id }) {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage({ input }) {
    // Create a random id for our "database".
    const id = uuidv4();

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage({ id, input }) {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};

export default root;
