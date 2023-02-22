'use strict'

const logoutCap = new LogoutButton();
const leftBoard = new RatesBoard();
const moneyBoard = new MoneyManager();
const favorites = new FavoritesWidget();
logoutCap.action = () => {
    const callback = (response) => {
        if (response.success) {
            console.log(response); 
            location.reload();
        } 
    };
    ApiConnector.logout(callback);
};

ApiConnector.current((response) => {
    if (response.success) {
        console.log(response);
        ProfileWidget.showProfile(response.data);
    }
});

function updateLeftBoard() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            leftBoard.clearTable();
            leftBoard.fillTable(response.data);
        }
    });
};

updateLeftBoard();
setInterval(() => (updateLeftBoard()), 60000);

moneyBoard.addMoneyCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            console.log(response);
            ProfileWidget.showProfile(response.data);
            moneyBoard.setMessage(response.success, "Операция успешно проведена");
        } else {
            moneyBoard.setMessage(response.success, "Операция отклонена");
        }
    }
    ApiConnector.addMoney({currency:data.currency, amount:data.amount}, callback)
};

moneyBoard.conversionMoneyCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            console.log(response);
            ProfileWidget.showProfile(response.data);
            moneyBoard.setMessage(response.success, "Валюта успешно конвертирована");
        } else {
            moneyBoard.setMessage(response.success, "Операция не проведена");
        }
    }
    ApiConnector.convertMoney({fromCurrency:data.fromCurrency, targetCurrency:data.targetCurrency, fromAmount:data.fromAmount}, callback)
}

moneyBoard.sendMoneyCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            console.log(response);
            ProfileWidget.showProfile(response.data);
            moneyBoard.setMessage(response.success, "Операция успешно проведена");
        } else {
            moneyBoard.setMessage(response.success, "Операция не проведена");
        }
    }
    ApiConnector.transferMoney({to:data.to, currency:data.currency, amount:data.amount}, callback)
}

function updateFavorites() {
    ApiConnector.getFavorites((response) => {
        if (response.success) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyBoard.updateUsersList(response.data);
        }
    });
};

updateFavorites();

favorites.addUserCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            console.log(response);
            updateFavorites();
            favorites.setMessage(response.success, "Пользователь успешно добавлен");
        } else {
            favorites.setMessage(response.success, "Не удалось добавить пользователя");
        }
    }
    ApiConnector.addUserToFavorites({id:data.id, name:data.name}, callback)
}

favorites.removeUserCallback = (data) => {
    const callback = (response) => {
        console.log(response);
        if (response.success) {
            console.log(response);
            updateFavorites();
            favorites.setMessage(response.success, "Пользователь успешно удален");
        } else {
            favorites.setMessage(response.success, "Не удалось удалить пользователя");
        }
    }
    ApiConnector.removeUserFromFavorites(data, callback)
}