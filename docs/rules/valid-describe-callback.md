# Enforce valid describe callback (`vitest/valid-describe-callback`)

<<<<<<< HEAD
💼 This rule is enabled in the ✅ `recommended` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->


This rule validates the second parameter of a `describe()` function is a callback. 

- should not be async 
- should not contain parameters 
- should not contain  any `return` statements

The following are considered warnings:

```js
// async callback functions are not allowed
describe("myfunc", async () => {
	// 
})

// callback function parameters are not allowed
describe("myfunc", done => {
	// 
})


describe("myfunc", () => {
	// no return statements are allowed in a block of a callback function
	return Promise.resolve().then(() => {
		// 
	})
})

// returning a value from a describe block is not allowed 
describe("myfunc", () => {
	it("should do something", () => {
		// 
	})
})
```

The following are not considered warnings:

```js
describe("myfunc", () => {
	it("should do something", () => {
		// 
	})
})
```