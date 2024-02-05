"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Notifications", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            source: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            event: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            message: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            data: {
                allowNull: true,
                type: Sequelize.JSON,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Notifications");
    },
};
