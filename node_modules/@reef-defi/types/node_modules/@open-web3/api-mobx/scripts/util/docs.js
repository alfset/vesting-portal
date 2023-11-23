"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _handlebars = _interopRequireDefault(require("handlebars"));

var _file = require("./file");

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
_handlebars.default.registerPartial({
  docs: _handlebars.default.compile((0, _file.readTemplate)('docs'))
});