import rule, { RULE_NAME } from '../src/rules/valid-expect-in-promise'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    "test('something', () => Promise.resolve().then(() => expect(1).toBe(2)));",
    'Promise.resolve().then(() => expect(1).toBe(2))',
    'const x = Promise.resolve().then(() => expect(1).toBe(2))',
    `
      it('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).resolves.toBe(1);
      });
    `,
    `
      it('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).resolves.not.toBe(2);
      });
    `,
    `
      it('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).rejects.toBe(1);
      });
    `,
    `
      it('is valid', () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(promise).rejects.not.toBe(2);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(await promise).toBeGreaterThan(1);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(await promise).resolves.toBeGreaterThan(1);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect(1).toBeGreaterThan(await promise);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect.this.that.is(await promise);
      });
    `,
    `
      it('is valid', async () => {
        expect(await loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        })).toBeGreaterThan(1);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect([await promise]).toHaveLength(1);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect([,,await promise,,]).toHaveLength(1);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        expect([[await promise]]).toHaveLength(1);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return number + 1;
        });

        logValue(await promise);
      });
    `,
    `
      it('is valid', async () => {
        const promise = loadNumber().then(number => {
          expect(typeof number).toBe('number');

          return 1;
        });

        expect.assertions(await promise);
      });
    `,
    `
      it('is valid', async () => {
        await loadNumber().then(number => {
          expect(typeof number).toBe('number');
        });
      });
    `,
    `
      it('it1', () => new Promise((done) => {
        test()
          .then(() => {
            expect(someThing).toEqual(true);
            done();
          });
      }));
    `,
    `
      it('it1', () => {
        return new Promise(done => {
          test().then(() => {
            expect(someThing).toEqual(true);
            done();
          });
        });
      });
    `,
    `
      it('passes', () => {
        Promise.resolve().then(() => {
          grabber.grabSomething();
        });
      });
    `,
    `
      it('passes', async () => {
        const grabbing = Promise.resolve().then(() => {
          grabber.grabSomething();
        });

        await grabbing;

        expect(grabber.grabbedItems).toHaveLength(1);
      });
    `,
    `
      const myFn = () => {
        Promise.resolve().then(() => {
          expect(true).toBe(false);
        });
      };
    `,
    `
      const myFn = () => {
        Promise.resolve().then(() => {
          subject.invokeMethod();
        });
      };
    `,
    `
      const myFn = () => {
        Promise.resolve().then(() => {
          expect(true).toBe(false);
        });
      };

      it('it1', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', () => new Promise((done) => {
        test()
          .finally(() => {
            expect(someThing).toEqual(true);
            done();
          });
      }));
    `,
    `
      it('it1', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', () => {
        return somePromise.finally(() => {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', function() {
        return somePromise.catch(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      xtest('it1', function() {
        return somePromise.catch(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', function() {
        return somePromise.then(function() {
          doSomeThingButNotExpect();
        });
      });
    `,
    `
      it('it1', function() {
        return getSomeThing().getPromise().then(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', function() {
        return Promise.resolve().then(function() {
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', function () {
        return Promise.resolve().then(function () {
          /*fulfillment*/
          expect(someThing).toEqual(true);
        }, function () {
          /*rejection*/
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', function () {
        Promise.resolve().then(/*fulfillment*/ function () {
        }, undefined, /*rejection*/ function () {
          expect(someThing).toEqual(true)
        })
      });
    `,
    `
      it('it1', function () {
        return Promise.resolve().then(function () {
          /*fulfillment*/
        }, function () {
          /*rejection*/
          expect(someThing).toEqual(true);
        });
      });
    `,
    `
      it('it1', function () {
        return somePromise.then()
      });
    `,
    `
      it('it1', async () => {
        await Promise.resolve().then(function () {
          expect(someThing).toEqual(true)
        });
      });
    `,
    `
      it('it1', async () => {
        await somePromise.then(() => {
          expect(someThing).toEqual(true)
        });
      });
    `,
    `
      it('it1', async () => {
        await getSomeThing().getPromise().then(function () {
          expect(someThing).toEqual(true)
        });
      });
    `,
    `
      it('it1', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        })
        .then(() => {
          expect(someThing).toEqual(true);
        })
      });
    `,
    `
      it('it1', () => {
        return somePromise.then(() => {
          return value;
        })
        .then(value => {
          expect(someThing).toEqual(value);
        })
      });
    `,
    `
      it('it1', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        })
        .then(() => {
          console.log('this is silly');
        })
      });
    `,
    `
      it('it1', () => {
        return somePromise.then(() => {
          expect(someThing).toEqual(true);
        })
        .catch(() => {
          expect(someThing).toEqual(false);
        })
      });
    `,
    `
      test('later return', () => {
        const promise = something().then(value => {
          expect(value).toBe('red');
        });

        return promise;
      });
    `,
    `
      test('later return', async () => {
        const promise = something().then(value => {
          expect(value).toBe('red');
        });

        await promise;
      });
    `,
    `
      test.only('later return', () => {
        const promise = something().then(value => {
          expect(value).toBe('red');
        });

        return promise;
      });
    `,
    `
      test('that we bailout if destructuring is used', () => {
        const [promise] = something().then(value => {
          expect(value).toBe('red');
        });
      });
    `,
    `
      test('that we bailout if destructuring is used', async () => {
        const [promise] = await something().then(value => {
          expect(value).toBe('red');
        });
      });
    `,
    `
      test('that we bailout if destructuring is used', () => {
        const [promise] = [
          something().then(value => {
            expect(value).toBe('red');
          })
        ];
      });
    `,
    `
      test('that we bailout if destructuring is used', () => {
        const {promise} = {
          promise: something().then(value => {
            expect(value).toBe('red');
          })
        };
      });
    `,
    `
      test('that we bailout in complex cases', () => {
        promiseSomething({
          timeout: 500,
          promise: something().then(value => {
            expect(value).toBe('red');
          })
        });
      });
    `,
    `
      it('shorthand arrow', () =>
        something().then(value => {
          expect(() => {
            value();
          }).toThrow();
        })
      );
    `,
    `
      it('crawls for files based on patterns', () => {
        const promise = nodeCrawl({}).then(data => {
          expect(childProcess.spawn).lastCalledWith('find');
        });
        return promise;
      });
    `,
    `
      it('is a test', async () => {
        const value = await somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });

        expect(value).toBe('hello world');
      });
    `,
    `
      it('is a test', async () => {
        return await somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });
      });
    `,
    `
      it('is a test', async () => {
        return somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });
      });
    `,
    `
      it('is a test', async () => {
        await somePromise().then(response => {
          expect(response).toHaveProperty('data');

          return response.data;
        });
      });
    `,
    `
      it(
        'test function',
        () => {
          return Builder
            .getPromiseBuilder()
            .get().build()
            .then((data) => {
              expect(data).toEqual('Hi');
            });
        }
      );
    `,
    `
      notATestFunction(
        'not a test function',
        () => {
          Builder
            .getPromiseBuilder()
            .get()
            .build()
            .then((data) => {
              expect(data).toEqual('Hi');
            });
        }
      );
    `,
    `
      it('is valid', async () => {
        const promiseOne = loadNumber().then(number => {
          expect(typeof number).toBe('number');
        });
        const promiseTwo = loadNumber().then(number => {
          expect(typeof number).toBe('number');
        });

        await promiseTwo;
        await promiseOne;
      });
    `,
    `
      it("it1", () => somePromise.then(() => {
        expect(someThing).toEqual(true)
      }))
    `,
    'it("it1", () => somePromise.then(() => expect(someThing).toEqual(true)))',
    `
      it('promise test with done', (done) => {
        const promise = getPromise();
        promise.then(() => expect(someThing).toEqual(true));
      });
    `,
    `
      it('name of done param does not matter', (nameDoesNotMatter) => {
        const promise = getPromise();
        promise.then(() => expect(someThing).toEqual(true));
      });
    `,
    `
      it.each([])('name of done param does not matter', (nameDoesNotMatter) => {
        const promise = getPromise();
        promise.then(() => expect(someThing).toEqual(true));
      });
    `,
    `
      it.each\`\`('name of done param does not matter', ({}, nameDoesNotMatter) => {
        const promise = getPromise();
        promise.then(() => expect(someThing).toEqual(true));
      });
    `,
    `
      test('valid-expect-in-promise', async () => {
        const text = await fetch('url')
            .then(res => res.text())
            .then(text => text);

        expect(text).toBe('text');
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        }), x = 1;

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let x = 1, somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        {}

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        {
          await somePromise;
        }
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        {
          await somePromise;

          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          await somePromise;
        }
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        {
          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          await somePromise;
        }
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        somePromise = somePromise.then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        somePromise = somePromise
          .then((data) => data)
          .then((data) => data)
          .then((data) => {
            expect(data).toEqual('foo');
          });

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        somePromise = somePromise
          .then((data) => data)
          .then((data) => data)

        await somePromise;
      });
    `,
    `
      test('promise test', async function () {
        let somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await somePromise;

        {
          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          {
            await somePromise;
          }
        }
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await Promise.all([somePromise]);
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return Promise.all([somePromise]);
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return Promise.resolve(somePromise);
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        return Promise.reject(somePromise);
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await Promise.resolve(somePromise);
      });
    `,
    `
      test('promise test', async function () {
        const somePromise = getPromise().then((data) => {
          expect(data).toEqual('foo');
        });

        await Promise.reject(somePromise);
      });
    `,
    `
      test('later return', async () => {
        const onePromise = something().then(value => {
          console.log(value);
        });
        const twoPromise = something().then(value => {
          expect(value).toBe('red');
        });

        return Promise.all([onePromise, twoPromise]);
      });
    `,
    `
      test('later return', async () => {
        const onePromise = something().then(value => {
          console.log(value);
        });
        const twoPromise = something().then(value => {
          expect(value).toBe('red');
        });

        return Promise.allSettled([onePromise, twoPromise]);
      });
    `,
  ],
  invalid: [
    {
      code: `
        const myFn = () => {
          Promise.resolve().then(() => {
            expect(true).toBe(false);
          });
        };

        it('it1', () => {
          somePromise.then(() => {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        {
          column: 11,
          endColumn: 14,
          messageId: 'expectInFloatingPromise',
          line: 9,
        },
      ],
    },
    {
      code: `
        it('it1', () => {
          somePromise.then(() => {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 11, endColumn: 14, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', () => {
          somePromise.finally(() => {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 11, endColumn: 14, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
       it('it1', () => {
         somePromise['then'](() => {
           expect(someThing).toEqual(true);
         });
       });
      `,
      errors: [
        { column: 10, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', function() {
          getSomeThing().getPromise().then(function() {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 11, endColumn: 14, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', function() {
          Promise.resolve().then(function() {
            expect(someThing).toEqual(true);
          });
        });
      `,
      errors: [
        { column: 11, endColumn: 14, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', function() {
          somePromise.catch(function() {
            expect(someThing).toEqual(true)
          })
        })
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        xtest('it1', function() {
          somePromise.catch(function() {
            expect(someThing).toEqual(true)
          })
        })
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', function() {
          somePromise.then(function() {
            expect(someThing).toEqual(true)
          })
        })
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', function () {
          Promise.resolve().then(/*fulfillment*/ function () {
            expect(someThing).toEqual(true);
          }, /*rejection*/ function () {
            expect(someThing).toEqual(true);
          })
        })
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', function () {
          Promise.resolve().then(/*fulfillment*/ function () {
          }, /*rejection*/ function () {
            expect(someThing).toEqual(true)
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('test function', () => {
          Builder.getPromiseBuilder()
            .get()
            .build()
            .then(data => expect(data).toEqual('Hi'));
        });
      `,
      errors: [
        { column: 11, endColumn: 55, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('test function', async () => {
          Builder.getPromiseBuilder()
            .get()
            .build()
            .then(data => expect(data).toEqual('Hi'));
        });
      `,
      errors: [
        { column: 11, endColumn: 55, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', () => {
          somePromise.then(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise
            .then(() => {})
            .then(() => expect(someThing).toEqual(value))
        });
      `,
      errors: [
        { column: 11, endColumn: 58, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise
            .then(() => expect(someThing).toEqual(value))
            .then(() => {})
        });
      `,
      errors: [
        { column: 11, endColumn: 28, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise.then(() => {
            return value;
          })
          .then(value => {
            expect(someThing).toEqual(value);
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise.then(() => {
            expect(someThing).toEqual(true);
          })
          .then(() => {
            console.log('this is silly');
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise.then(() => {
            // return value;
          })
          .then(value => {
            expect(someThing).toEqual(value);
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise.then(() => {
            return value;
          })
          .then(value => {
            expect(someThing).toEqual(value);
          })

          return anotherPromise.then(() => expect(x).toBe(y));
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise
            .then(() => 1)
            .then(x => x + 1)
            .catch(() => -1)
            .then(v => expect(v).toBe(2));

          return anotherPromise.then(() => expect(x).toBe(y));
        });
      `,
      errors: [
        { column: 11, endColumn: 43, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('is a test', () => {
          somePromise
            .then(() => 1)
            .then(v => expect(v).toBe(2))
            .then(x => x + 1)
            .catch(() => -1);

          return anotherPromise.then(() => expect(x).toBe(y));
        });
      `,
      errors: [
        { column: 11, endColumn: 30, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('it1', () => {
          somePromise.finally(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('invalid return', () => {
          const promise = something().then(value => {
            const foo = "foo";
            return expect(value).toBe('red');
          });
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        fit('it1', () => {
          somePromise.then(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it.skip('it1', () => {
          somePromise.then(() => {
            doSomeOperation();
            expect(someThing).toEqual(true);
          })
        });
      `,
      errors: [
        { column: 11, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return;

          await promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return 1;

          await promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return [];

          await promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return Promise.all([anotherPromise]);

          await promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return {};

          await promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          return Promise.all([]);

          await promise;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await 1;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await [];
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await Promise.all([anotherPromise]);
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await {};
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          await Promise.all([]);
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          }), x = 1;
        });
      `,
      errors: [
        { column: 17, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('later return', async () => {
          const x = 1, promise = something().then(value => {
            expect(value).toBe('red');
          });
        });
      `,
      errors: [
        { column: 24, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        import { test } from 'vitest';

        test('later return', async () => {
          const x = 1, promise = something().then(value => {
            expect(value).toBe('red');
          });
        });
      `,
      languageOptions: {
        parserOptions: { sourceType: 'module' },
      },
      errors: [
        { column: 24, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        it('promise test', () => {
          const somePromise = getThatPromise();
          somePromise.then((data) => {
            expect(data).toEqual('foo');
          });
          expect(somePromise).toBeDefined();
          return somePromise;
        });
      `,
      errors: [
        { column: 11, endColumn: 14, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('promise test', function () {
          let somePromise = getThatPromise();
          somePromise.then((data) => {
            expect(data).toEqual('foo');
          });
          expect(somePromise).toBeDefined();
          return somePromise;
        });
      `,
      errors: [
        { column: 11, endColumn: 14, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          somePromise = null;

          await somePromise;
        });
      `,
      errors: [
        { column: 15, endColumn: 13, messageId: 'expectInFloatingPromise' },
      ],
    },
    {
      code: `
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          await somePromise;
        });
      `,
      errors: [
        {
          column: 15,
          endColumn: 13,
          line: 3,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: `
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          ({ somePromise } = {})
        });
      `,
      errors: [
        {
          column: 15,
          endColumn: 13,
          line: 3,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: `
        test('promise test', async function () {
          let somePromise = getPromise().then((data) => {
            expect(data).toEqual('foo');
          });

          {
            somePromise = getPromise().then((data) => {
              expect(data).toEqual('foo');
            });

            await somePromise;
          }
        });
      `,
      errors: [
        {
          column: 15,
          endColumn: 13,
          line: 3,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: `
        test('that we error on this destructuring', async () => {
          [promise] = something().then(value => {
            expect(value).toBe('red');
          });
        });
      `,
      errors: [
        {
          column: 11,
          endColumn: 13,
          line: 3,
          messageId: 'expectInFloatingPromise',
        },
      ],
    },
    {
      code: `
        test('that we error on this', () => {
          const promise = something().then(value => {
            expect(value).toBe('red');
          });

          log(promise);
        });
      `,
      errors: [
        {
          messageId: 'expectInFloatingPromise',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
        it('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(promise).toBeInstanceOf(Promise);
        });
      `,
      errors: [
        {
          messageId: 'expectInFloatingPromise',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
        it('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(anotherPromise).resolves.toBe(1);
        });
      `,
      errors: [
        {
          messageId: 'expectInFloatingPromise',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
        import { it as promiseThatThis } from 'vitest';

        promiseThatThis('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(anotherPromise).resolves.toBe(1);
        });
      `,
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'expectInFloatingPromise',
          line: 5,
          column: 17,
        },
      ],
    },
    {
      code: `
        promiseThatThis('is valid', async () => {
          const promise = loadNumber().then(number => {
            expect(typeof number).toBe('number');

            return number + 1;
          });

          expect(anotherPromise).resolves.toBe(1);
        });
      `,
      errors: [
        {
          messageId: 'expectInFloatingPromise',
          line: 3,
          column: 17,
        },
      ],
      settings: { vitest: { globalAliases: { xit: ['promiseThatThis'] } } },
    },
  ],
})
