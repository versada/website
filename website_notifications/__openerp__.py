# -*- coding: utf-8 -*-
# This file is part of Odoo. The COPYRIGHT file at the top level of
# this module contains the full copyright notices and license terms.
{
    'name': 'Website Notifications',
    'version': '10.0.0.1.0',
    'author': 'Versada',
    'category': 'Custom',
    'website': 'http://versada.lt/',
    'licence': 'AGPL-3',
    'summary': 'Odoo Framework for Notifications',
    'depends': [
        'website',
    ],
    'data': [
        'views/assets.xml',
    ],
    'qweb': [
        'static/src/xml/templates.xml',
    ],
    'installable': True,
    'application': False,
}
