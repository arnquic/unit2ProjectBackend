'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("packItems",
      [
        {
          name: "T-shirt",
          type: "Partial Top Covering",
          weatherUse: "cold, warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Long-Sleeved Shirt",
          type: "Full Top Covering",
          weatherUse: "frigid, cold, warm",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Sweatshirt",
          type: "Full Top Covering",
          weatherUse: "frigid, cold, warm",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Shorts",
          type: "Partial-length Leg Covering",
          weatherUse: "warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Pants",
          type: "Full-length Leg Covering",
          weatherUse: "frigid, cold, warm",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Short Skirt",
          type: "Partial-length Leg Covering",
          weatherUse: "warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Full-length Skirt",
          type: "Full-length Leg Covering",
          weatherUse: "cold, warm",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Jumper",
          type: "Full-length Body Covering",
          weatherUse: "cold, warm",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Underwear",
          type: "Undergarment",
          weatherUse: "frigid, cold, warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Long Underwear",
          type: "Undergarment",
          weatherUse: "frigid",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Bra",
          type: "Undergarment",
          weatherUse: "frigid, cold, warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Socks",
          type: "Sock",
          weatherUse: "frigid, cold, warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Sneakers",
          type: "Footwear",
          weatherUse: "frigid, cold, warm, hot",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Winter Boots",
          type: "Footwear",
          weatherUse: "frigid",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Light Jacket",
          type: "Light Jacket",
          weatherUse: "cold",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Heavy Jacket",
          type: "Heavy Jacket",
          weatherUse: "frigid",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Winter Hat",
          type: "Hat",
          weatherUse: "frigid",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Winter Gloves",
          type: "Gloves",
          weatherUse: "frigid",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
